import dayjs from 'dayjs';
import Subscription from '../model/subscription.model.js';

import {createRequire} from 'module';
import { sendReminderEmail } from '../utils/send-email.js';
const require = createRequire(import.meta.url);

const {serve} = require('@upstash/workflow/express');

const REMINDERS = [7,5,2,1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);

  if(!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);
  if(renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date for subscription ${subscriptionId} has passed. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS){
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    if(reminderDate.isAfter(dayjs())){
        await sleepUntilReminder(context, `Reminder-${daysBefore} days before`, reminderDate);
    }

    await triggerReminder(context, `Reminder-${daysBefore} days before reminder`, subscription);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    const subscription = await Subscription.findById(subscriptionId).populate('user', 'name email');
    
    // Convert to plain object to avoid circular reference issues
    if (!subscription) return null;
    
    const subscriptionData = subscription.toObject();
    
    // Ensure ObjectIds are converted to strings
    return {
      ...subscriptionData,
      _id: subscriptionData._id.toString(),
      user: {
        _id: subscriptionData.user._id.toString(),
        name: subscriptionData.user.name,
        email: subscriptionData.user.email
      }
    };
  });
}

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder for subscription: ${subscription.name}`);
    console.log(`User: ${subscription.user.name} (${subscription.user.email})`);
    
    // Here you would send the actual reminder, e.g., via email or notification
    // Example: await sendEmail(subscription.user.email, reminderTemplate);


    await sendReminderEmail({
        to: subscription.user.email,
        type: label, 
    })
    
    return { 
      status: 'sent', 
      subscriptionId: subscription._id,
      userEmail: subscription.user.email 
    };
  });
} 