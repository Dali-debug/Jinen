import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase admin client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Create Supabase client for auth operations
const supabaseAuth = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

// Initialize storage bucket on startup
const bucketName = 'make-36fca577-nursery-images';
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
      console.log(`Created bucket: ${bucketName}`);
    }
  } catch (error) {
    console.error(`Error initializing storage bucket: ${error}`);
  }
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-36fca577/health", (c) => {
  return c.json({ status: "ok" });
});

// ============== AUTH ROUTES ==============

// Sign up route
app.post("/make-server-36fca577/auth/signup", async (c) => {
  try {
    const { email, password, name, userType } = await c.req.json();
    
    if (!email || !password || !name || !userType) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    if (userType !== 'parent' && userType !== 'nursery') {
      return c.json({ error: 'Invalid user type' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, userType },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error(`Sign up error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in KV store
    if (data.user) {
      await kv.set(`user:${data.user.id}`, {
        id: data.user.id,
        email,
        name,
        userType,
        createdAt: new Date().toISOString()
      });
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error(`Sign up error: ${error}`);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// ============== NURSERY ROUTES ==============

// Create nursery
app.post("/make-server-36fca577/nurseries", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const nurseryData = await c.req.json();
    const nurseryId = `nursery:${crypto.randomUUID()}`;
    
    const nursery = {
      id: nurseryId,
      ownerId: user.id,
      ...nurseryData,
      rating: 0,
      ratingCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(nurseryId, nursery);
    await kv.set(`user:${user.id}:nursery`, nurseryId);

    return c.json({ success: true, nursery });
  } catch (error) {
    console.error(`Create nursery error: ${error}`);
    return c.json({ error: 'Failed to create nursery' }, 500);
  }
});

// Get all nurseries
app.get("/make-server-36fca577/nurseries", async (c) => {
  try {
    const nurseries = await kv.getByPrefix('nursery:');
    return c.json({ nurseries: nurseries || [] });
  } catch (error) {
    console.error(`Get nurseries error: ${error}`);
    return c.json({ error: 'Failed to fetch nurseries' }, 500);
  }
});

// Get single nursery
app.get("/make-server-36fca577/nurseries/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const nursery = await kv.get(id);
    
    if (!nursery) {
      return c.json({ error: 'Nursery not found' }, 404);
    }

    return c.json({ nursery });
  } catch (error) {
    console.error(`Get nursery error: ${error}`);
    return c.json({ error: 'Failed to fetch nursery' }, 500);
  }
});

// Update nursery
app.put("/make-server-36fca577/nurseries/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const existingNursery = await kv.get(id);
    
    if (!existingNursery) {
      return c.json({ error: 'Nursery not found' }, 404);
    }

    if (existingNursery.ownerId !== user.id) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const updates = await c.req.json();
    const updatedNursery = {
      ...existingNursery,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(id, updatedNursery);

    return c.json({ success: true, nursery: updatedNursery });
  } catch (error) {
    console.error(`Update nursery error: ${error}`);
    return c.json({ error: 'Failed to update nursery' }, 500);
  }
});

// Upload nursery image
app.post("/make-server-36fca577/nurseries/:id/upload-image", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const nurseryId = c.req.param('id');
    const { imageData, fileName } = await c.req.json();

    // Decode base64 image
    const base64Data = imageData.split(',')[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    const filePath = `${nurseryId}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, binaryData, { upsert: true });

    if (uploadError) {
      console.error(`Upload error: ${uploadError.message}`);
      return c.json({ error: uploadError.message }, 500);
    }

    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 31536000); // 1 year

    return c.json({ success: true, url: signedUrlData?.signedUrl });
  } catch (error) {
    console.error(`Upload image error: ${error}`);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
});

// ============== CHILD REGISTRATION ROUTES ==============

// Register child
app.post("/make-server-36fca577/children", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const childData = await c.req.json();
    const childId = `child:${crypto.randomUUID()}`;
    
    const child = {
      id: childId,
      parentId: user.id,
      ...childData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await kv.set(childId, child);
    
    // Add to parent's children list
    const parentChildren = await kv.get(`parent:${user.id}:children`) || [];
    parentChildren.push(childId);
    await kv.set(`parent:${user.id}:children`, parentChildren);

    // Add to nursery's children list
    const nurseryChildren = await kv.get(`nursery:${childData.nurseryId}:children`) || [];
    nurseryChildren.push(childId);
    await kv.set(`nursery:${childData.nurseryId}:children`, nurseryChildren);

    return c.json({ success: true, child });
  } catch (error) {
    console.error(`Register child error: ${error}`);
    return c.json({ error: 'Failed to register child' }, 500);
  }
});

// Get children for parent
app.get("/make-server-36fca577/parent/children", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const childrenIds = await kv.get(`parent:${user.id}:children`) || [];
    const children = await kv.mget(childrenIds);

    return c.json({ children: children || [] });
  } catch (error) {
    console.error(`Get parent children error: ${error}`);
    return c.json({ error: 'Failed to fetch children' }, 500);
  }
});

// Get children for nursery
app.get("/make-server-36fca577/nursery/:nurseryId/children", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const nurseryId = c.req.param('nurseryId');
    const childrenIds = await kv.get(`nursery:${nurseryId}:children`) || [];
    const children = await kv.mget(childrenIds);

    // Get parent info for each child
    const childrenWithParents = await Promise.all(
      (children || []).map(async (child: any) => {
        const parent = await kv.get(`user:${child.parentId}`);
        return { ...child, parentInfo: parent };
      })
    );

    return c.json({ children: childrenWithParents });
  } catch (error) {
    console.error(`Get nursery children error: ${error}`);
    return c.json({ error: 'Failed to fetch children' }, 500);
  }
});

// Update child status
app.put("/make-server-36fca577/children/:id/status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const childId = c.req.param('id');
    const { status } = await c.req.json();
    
    const child = await kv.get(childId);
    if (!child) {
      return c.json({ error: 'Child not found' }, 404);
    }

    const updatedChild = { ...child, status, updatedAt: new Date().toISOString() };
    await kv.set(childId, updatedChild);

    return c.json({ success: true, child: updatedChild });
  } catch (error) {
    console.error(`Update child status error: ${error}`);
    return c.json({ error: 'Failed to update child status' }, 500);
  }
});

// ============== CHILD UPDATES ROUTES ==============

// Post update for child
app.post("/make-server-36fca577/children/:childId/updates", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const childId = c.req.param('childId');
    const updateData = await c.req.json();
    const updateId = `update:${crypto.randomUUID()}`;
    
    const update = {
      id: updateId,
      childId,
      ...updateData,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };

    await kv.set(updateId, update);
    
    // Add to child's updates list
    const childUpdates = await kv.get(`child:${childId}:updates`) || [];
    childUpdates.unshift(updateId);
    await kv.set(`child:${childId}:updates`, childUpdates);

    return c.json({ success: true, update });
  } catch (error) {
    console.error(`Post child update error: ${error}`);
    return c.json({ error: 'Failed to post update' }, 500);
  }
});

// Get updates for child
app.get("/make-server-36fca577/children/:childId/updates", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const childId = c.req.param('childId');
    const updateIds = await kv.get(`child:${childId}:updates`) || [];
    const updates = await kv.mget(updateIds);

    return c.json({ updates: updates || [] });
  } catch (error) {
    console.error(`Get child updates error: ${error}`);
    return c.json({ error: 'Failed to fetch updates' }, 500);
  }
});

// ============== PROGRAM ROUTES ==============

// Create/Update program
app.post("/make-server-36fca577/nurseries/:nurseryId/program", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const nurseryId = c.req.param('nurseryId');
    const programData = await c.req.json();
    
    const program = {
      nurseryId,
      ...programData,
      updatedBy: user.id,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`${nurseryId}:program`, program);

    return c.json({ success: true, program });
  } catch (error) {
    console.error(`Update program error: ${error}`);
    return c.json({ error: 'Failed to update program' }, 500);
  }
});

// Get program
app.get("/make-server-36fca577/nurseries/:nurseryId/program", async (c) => {
  try {
    const nurseryId = c.req.param('nurseryId');
    const program = await kv.get(`${nurseryId}:program`);

    return c.json({ program: program || null });
  } catch (error) {
    console.error(`Get program error: ${error}`);
    return c.json({ error: 'Failed to fetch program' }, 500);
  }
});

// ============== PAYMENT ROUTES ==============

// Create payment
app.post("/make-server-36fca577/payments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const paymentData = await c.req.json();
    const paymentId = `payment:${crypto.randomUUID()}`;
    
    const payment = {
      id: paymentId,
      parentId: user.id,
      ...paymentData,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    await kv.set(paymentId, payment);
    
    // Add to nursery's payments
    const nurseryPayments = await kv.get(`nursery:${paymentData.nurseryId}:payments`) || [];
    nurseryPayments.unshift(paymentId);
    await kv.set(`nursery:${paymentData.nurseryId}:payments`, nurseryPayments);

    // Add to parent's payments
    const parentPayments = await kv.get(`parent:${user.id}:payments`) || [];
    parentPayments.unshift(paymentId);
    await kv.set(`parent:${user.id}:payments`, parentPayments);

    return c.json({ success: true, payment });
  } catch (error) {
    console.error(`Create payment error: ${error}`);
    return c.json({ error: 'Failed to create payment' }, 500);
  }
});

// Get payments for nursery
app.get("/make-server-36fca577/nursery/:nurseryId/payments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const nurseryId = c.req.param('nurseryId');
    const paymentIds = await kv.get(`nursery:${nurseryId}:payments`) || [];
    const payments = await kv.mget(paymentIds);

    // Get parent info for each payment
    const paymentsWithParents = await Promise.all(
      (payments || []).map(async (payment: any) => {
        const parent = await kv.get(`user:${payment.parentId}`);
        return { ...payment, parentInfo: parent };
      })
    );

    return c.json({ payments: paymentsWithParents });
  } catch (error) {
    console.error(`Get nursery payments error: ${error}`);
    return c.json({ error: 'Failed to fetch payments' }, 500);
  }
});

// Get payments for parent
app.get("/make-server-36fca577/parent/payments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const paymentIds = await kv.get(`parent:${user.id}:payments`) || [];
    const payments = await kv.mget(paymentIds);

    return c.json({ payments: payments || [] });
  } catch (error) {
    console.error(`Get parent payments error: ${error}`);
    return c.json({ error: 'Failed to fetch payments' }, 500);
  }
});

// Get user profile
app.get("/make-server-36fca577/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    
    // If user is nursery owner, get nursery info
    if (profile?.userType === 'nursery') {
      const nurseryId = await kv.get(`user:${user.id}:nursery`);
      if (nurseryId) {
        const nursery = await kv.get(nurseryId);
        profile.nursery = nursery;
      }
    }

    return c.json({ profile });
  } catch (error) {
    console.error(`Get profile error: ${error}`);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

Deno.serve(app.fetch);
