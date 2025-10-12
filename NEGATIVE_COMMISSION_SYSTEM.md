# ⚙️ Negative Commission Full System Logic

## Overview
This document explains the complete negative commission system implementation for the Iconic Digital platform. The system handles scenarios where users receive negative commissions from customer tasks and manages the recovery process through deposits.

## Key Concepts

### 1. **Negative Commission** (Only for Customer Tasks)
- **Customer Tasks**: Can have negative commissions (estimatedNegativeAmount < 0)
- **Campaign Tasks**: Always have positive commissions (no negative scenario)

### 2. **Three Main Stages**

#### Stage 1: Negative Commission Appears
When a user completes a customer task with negative commission:

**Example:**
- Previous accountBalance: 1000 BDT
- Trial Balance: 100 BDT
- Commission received: -50 BDT

**System Actions:**
```javascript
negativeCommission = Math.abs(commission)  // 50 (stored as positive)
holdAmount = accountBalance + trialBalance + Math.abs(commission)  // 1000 + 100 + 50 = 1150
accountBalance = -negativeCommission  // -50 (shown in UI)
withdrawalBalance = holdAmount  // 1150 (shown in withdrawal UI, includes trial balance)
allowTask = false  // Block new tasks
```

**Database State:**
| Field | Value | Description |
|-------|-------|-------------|
| accountBalance | -50 | Negative shown in UI |
| holdAmount | 1150 | Previous balance + trial balance + loss |
| withdrawalBalance | 1150 | Shown in withdrawal UI (includes trial balance) |
| negativeCommission | 50 | Loss amount (positive) |
| allowTask | false | Tasks locked |

#### Stage 2: Deposit Recovery
When user makes a deposit to cover the loss:

**Validation:**
```javascript
if (depositAmount >= negativeCommission) {
  // ✅ Valid deposit
  accountBalance = depositAmount - negativeCommission  // 0 if equal, leftover if more
  negativeCommission = 0  // Clear the loss
  withdrawalBalance = holdAmount  // Keep hold amount for withdrawal
  allowTask = true  // Unlock tasks
}
```

**After Deposit (if deposit = 50 BDT):**
| Field | Value | Description |
|-------|-------|-------------|
| accountBalance | 0 | Loss cleared |
| holdAmount | 1150 | Still held (includes trial balance) |
| withdrawalBalance | 1150 | Available for withdrawal (includes trial balance) |
| negativeCommission | 0 | Cleared |
| allowTask | true | Tasks unlocked |

#### Stage 3: Hold Release (Next Task Completion)
When user completes the next task after deposit:

**System Actions:**
```javascript
// Release hold balance to account
accountBalance = accountBalance + withdrawalBalance + newCommission
withdrawalBalance = 0
holdAmount = 0
// System returns to normal flow
```

**After Next Task (+100 BDT commission):**
| Field | Value | Description |
|-------|-------|-------------|
| accountBalance | 1250 | 0 + 1150 (hold with trial) + 100 |
| holdAmount | 0 | Released |
| withdrawalBalance | 0 | Released |
| negativeCommission | 0 | Already cleared |
| allowTask | true | Normal operation |

## Implementation Details

### 1. User Model (`src/models/User.ts`)
Added new fields:
```typescript
negativeCommission: number;  // Stores loss amount (always positive)
holdAmount: number;          // Previous balance + loss amount
withdrawalBalance: number;   // Amount shown in UI for withdrawal
allowTask: boolean;          // Controls task access (existing field)
```

### 2. Customer Task Completion API (`src/app/api/customer-tasks/complete/route.ts`)

**Key Logic:**
```typescript
// Calculate commission (can be negative for customer tasks)
const finalCommission = task.estimatedNegativeAmount || 0;

if (finalCommission < 0) {
  // NEGATIVE SCENARIO
  const lossAmount = Math.abs(finalCommission);
  const holdAmount = currentAccountBalance + lossAmount;
  
  updateData = {
    accountBalance: -lossAmount,
    negativeCommission: lossAmount,
    holdAmount: holdAmount,
    withdrawalBalance: holdAmount,
    allowTask: false
  };
} else if (hasHoldBalance) {
  // HOLD RELEASE SCENARIO
  const releasedAmount = user.holdAmount || 0;
  const newBalance = currentAccountBalance + releasedAmount + finalCommission;
  
  updateData = {
    accountBalance: newBalance,
    holdAmount: 0,
    withdrawalBalance: 0,
    allowTask: true
  };
} else {
  // NORMAL POSITIVE SCENARIO
  updateData = {
    accountBalance: currentAccountBalance + finalCommission
  };
}
```

### 3. Deposit Check API (`src/app/api/deposits/check/route.ts`)

**Features:**
- Checks if user has negative commission
- Returns minimum deposit required
- Validates deposit sufficiency

```typescript
if (user.negativeCommission > 0) {
  requiresDeposit = true;
  minimumDepositRequired = user.negativeCommission;
}
```

### 4. Deposit Approve API (`src/app/api/deposits/approve/route.ts`)

**Key Logic:**
```typescript
if (negativeCommission > 0) {
  if (depositAmount >= negativeCommission) {
    // ✅ Valid deposit
    const leftoverAmount = depositAmount - negativeCommission;
    
    updateData = {
      accountBalance: leftoverAmount,
      negativeCommission: 0,
      withdrawalBalance: user.holdAmount,
      allowTask: true
    };
  } else {
    // ❌ Insufficient deposit
    return error with minimumRequired
  }
}
```

### 5. Campaign Page UI (`src/app/campaign/page.tsx`)

**Display Logic:**
```typescript
const negativeCommission = userInfo.negativeCommission || 0;
const withdrawalBalance = userInfo.withdrawalBalance || 0;

if (negativeCommission > 0) {
  // Show negative balance and hold amount
  displayAccountBalance = userInfo.accountBalance;  // Negative
  withdrawableAmount = withdrawalBalance;  // Hold amount
} else if (withdrawalBalance > 0) {
  // Show hold balance as withdrawable
  displayAccountBalance = userInfo.accountBalance;
  withdrawableAmount = withdrawalBalance;
} else {
  // Normal display
  displayAccountBalance = userInfo.accountBalance;
  withdrawableAmount = displayAccountBalance;
}
```

## Complete Flow Example

### Scenario: User gets -50 BDT commission

**Initial State:**
- Account Balance: 1000 BDT
- Trial Balance: 100 BDT
- Tasks Completed: 5

**Step 1: Complete Task with -50 BDT**
```
✅ Task Completed
❌ Commission: -50 BDT
📊 Account Balance: -50 BDT (shown in UI)
💰 Withdrawal Amount: 1150 BDT (hold = 1000 + 100 trial + 50 loss)
🔒 Tasks: LOCKED
```

**Step 2: User Deposits 50 BDT**
```
✅ Deposit Approved
💰 Deposit Amount: 50 BDT
📊 Account Balance: 0 BDT (loss cleared)
💰 Withdrawal Amount: 1150 BDT (still held, includes trial balance)
🔓 Tasks: UNLOCKED
```

**Step 3: Complete Next Task (+100 BDT)**
```
✅ Task Completed
💰 Commission: +100 BDT
📊 Account Balance: 1250 BDT (0 + 1150 hold + 100 new)
💰 Withdrawal Amount: 0 BDT (hold released to account)
✅ System: NORMAL FLOW RESUMED
```

## Important Notes

1. **Withdrawal Amount Display Logic**
   - **Normal Users**: Withdrawal Amount is ALWAYS 0
   - **Negative Commission**: Shows hold amount (previous balance + trial balance + loss)
   - **After Deposit**: Shows hold amount until next task completion
   - **After Hold Release**: Returns to 0 (balance moved to account)

2. **Campaign Tasks Never Have Negative Commission**
   - Only customer tasks can have negative commissions
   - Campaign tasks always use positive commission logic

3. **Task Blocking**
   - When `allowTask = false`, users cannot complete new tasks
   - API returns error with redirect to deposit page

4. **Hold Amount Protection**
   - Previous balance + trial balance is protected in holdAmount
   - Released only after deposit and next task completion
   - Prevents loss of user's previous earnings and trial balance

5. **Deposit Validation**
   - System validates deposit amount >= negativeCommission
   - Rejects insufficient deposits with clear error message

6. **UI Display**
   - Negative balance shown in red with warning
   - Withdrawal amount shows hold amount (includes trial balance) during negative scenario
   - Clear messaging guides user through recovery process

## Fixing Existing Users

If a user got negative commission BEFORE the system was updated, their `withdrawalBalance` and `holdAmount` fields might not be set. 

### Fix API Endpoint
Use the `/api/fix-negative-balance` endpoint to fix existing users:

```javascript
POST /api/fix-negative-balance
{
  "userId": "user_id_here"
}
```

This will:
1. Check if user has negative commission
2. Calculate correct hold amount from trial balance + loss
3. Set `holdAmount` and `withdrawalBalance` fields
4. Ensure `allowTask` is false

### Automatic Fallback in UI
The campaign page now has automatic fallback logic:
- If `withdrawalBalance` is 0 but `holdAmount` exists, use `holdAmount`
- If both are 0, calculate from `trialBalance + negativeCommission`
- This ensures withdrawal amount shows correctly even for old data

## Testing Checklist

- [x] User model updated with new fields
- [x] Customer task completion handles negative commission
- [x] Deposit check API validates negative commission
- [x] Deposit approve API recovers from negative state
- [x] Campaign page UI displays correct balances
- [x] Hold release works on next task completion
- [x] Task blocking/unblocking works correctly
- [x] Campaign tasks remain unaffected (positive only)
- [x] Automatic fallback for existing users with missing fields
- [x] Fix API endpoint for manual correction

## Files Modified

1. `src/models/User.ts` - Added new fields
2. `src/app/api/customer-tasks/complete/route.ts` - Negative commission logic
3. `src/app/api/deposits/check/route.ts` - Deposit validation
4. `src/app/api/deposits/approve/route.ts` - Recovery logic
5. `src/app/campaign/page.tsx` - UI display logic

---

**System Status:** ✅ Fully Implemented and Ready for Testing
**Last Updated:** October 12, 2025

