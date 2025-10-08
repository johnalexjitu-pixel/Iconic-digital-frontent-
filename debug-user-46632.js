// Debug script for user 46632
const { MongoClient } = require('mongodb');

async function debugUser46632() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('iconicdigital');
    
    console.log('🔍 Debugging user 46632...');
    
    // Find user by membershipId
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ membershipId: '46632' });
    
    if (!user) {
      console.log('❌ User with membershipId 46632 not found');
      return;
    }
    
    console.log('✅ User found:', {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      membershipId: user.membershipId,
      campaignsCompleted: user.campaignsCompleted,
      accountBalance: user.accountBalance
    });
    
    // Check customer tasks
    const customerTasksCollection = db.collection('customerTasks');
    const customerTasks = await customerTasksCollection.find({ 
      customerId: user._id.toString() 
    }).toArray();
    
    console.log(`📋 Customer tasks for user: ${customerTasks.length}`);
    if (customerTasks.length > 0) {
      console.log('Sample customer task:', {
        taskNumber: customerTasks[0].taskNumber,
        taskTitle: customerTasks[0].taskTitle,
        status: customerTasks[0].status
      });
    }
    
    // Check completed tasks (claims)
    const claimsCollection = db.collection('campaignClaims');
    const claims = await claimsCollection.find({ 
      customerId: user._id.toString() 
    }).toArray();
    
    console.log(`✅ Completed tasks (claims): ${claims.length}`);
    if (claims.length > 0) {
      console.log('Sample claim:', {
        taskId: claims[0].taskId,
        claimedAt: claims[0].claimedAt
      });
    }
    
    // Check campaigns collection
    const campaignsCollection = db.collection('campaigns');
    const campaigns = await campaignsCollection.find({}).toArray();
    
    console.log(`📊 Total campaigns available: ${campaigns.length}`);
    if (campaigns.length > 0) {
      console.log('Sample campaign:', {
        title: campaigns[0].title,
        platform: campaigns[0].platform,
        commission: campaigns[0].commission,
        status: campaigns[0].status
      });
    }
    
    // Simulate the next-task API logic
    console.log('\n🎯 Simulating next-task API logic:');
    
    const completedTaskIds = claims.map(claim => claim.taskId);
    console.log(`Completed task IDs: [${completedTaskIds.join(', ')}]`);
    
    // Check available customer tasks
    const availableCustomerTasks = customerTasks.filter(task => 
      !completedTaskIds.includes(task._id.toString())
    );
    
    console.log(`Available customer tasks: ${availableCustomerTasks.length}`);
    
    if (availableCustomerTasks.length > 0) {
      console.log('✅ Should return customer task:', availableCustomerTasks[0].taskTitle);
    } else {
      console.log('📋 No customer tasks available, should fallback to campaigns');
      
      if (campaigns.length > 0) {
        console.log('✅ Should return campaign task:', campaigns[0].title);
      } else {
        console.log('❌ No campaigns available either');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugUser46632();
