// Test script to check user's task completion status
const { MongoClient } = require('mongodb');

async function checkUserTasks() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('iconicdigital');
    
    // Get user ID from command line argument
    const userId = process.argv[2];
    if (!userId) {
      console.log('Usage: node check-tasks.js <userId>');
      process.exit(1);
    }
    
    console.log(`🔍 Checking tasks for user: ${userId}`);
    
    // Check customer tasks
    const tasksCollection = db.collection('customerTasks');
    const tasks = await tasksCollection.find({ customerId: userId }).sort({ taskNumber: 1 }).toArray();
    console.log(`📋 Total customer tasks: ${tasks.length}`);
    
    // Check completed tasks
    const claimsCollection = db.collection('campaignClaims');
    const claims = await claimsCollection.find({ customerId: userId }).toArray();
    console.log(`✅ Completed tasks: ${claims.length}`);
    
    // Show completed task IDs
    const completedTaskIds = claims.map(claim => claim.taskId);
    console.log(`📝 Completed task IDs:`, completedTaskIds);
    
    // Show available tasks
    const availableTasks = tasks.filter(task => !completedTaskIds.includes(task._id.toString()));
    console.log(`🎯 Available tasks: ${availableTasks.length}`);
    
    if (availableTasks.length > 0) {
      console.log(`📋 Next task: ${availableTasks[0].taskTitle} (Task #${availableTasks[0].taskNumber})`);
    } else {
      console.log('❌ No available tasks found');
    }
    
    // Show user info
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: require('mongodb').ObjectId(userId) });
    if (user) {
      console.log(`👤 User: ${user.name} (${user.email})`);
      console.log(`💰 Account Balance: BDT ${user.accountBalance}`);
      console.log(`📊 Campaigns Completed: ${user.campaignsCompleted}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkUserTasks();
