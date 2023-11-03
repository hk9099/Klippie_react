import React from 'react';
import { GoDotFill } from 'react-icons/go';

function SubscriptionModal({ Subscription }) {
  if (!Subscription) {
    return null;
  }

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatAmount = (amount) => {
    const formattedAmount = (amount / 100).toFixed(2); // Divide by 100 and round to two decimal places
    return `$${formattedAmount}`;
  };

  const convertToUserTimeZone = (timestamp) => {
    return new Date(timestamp).toLocaleString(undefined, { timeZone: userTimeZone });
  };

  const getStatusDot = (is_active) => {
    const dotColor = is_active ? 'text-green-500' : 'text-red-500';
    return <GoDotFill className={`inline text-2xl ${dotColor}`} />;
  };

  return (
    <div className="dark:bg-transparent pt-0 p-4 rounded-lg dark:text-white select-none">
      <h2 className="text-2xl mb-2 text-center dark:text-white font-bold">
        Subscription Details 📋
      </h2>
      <hr className="mb-4" />
      <div className="dark:bg-transparent rounded-lg mb-4 dark:text-white">
        <p className="mb-2 break-all text-ellipsis font-bold">
          ID: <span className="text-gray-100 font-medium">{Subscription.id}</span>
        </p>
        <p className="mb-2">
        <span className="font-bold">Status:</span> 
           {getStatusDot(Subscription.is_active)}{' '}
          <span className={Subscription.is_active ? 'text-green-500' : 'text-red-500'}>
            {Subscription.is_active ? 'Active' : 'Inactive'}
          </span>
        </p>
        <p className="mb-2">
          <span className="font-bold">Next Invoice date</span> {convertToUserTimeZone(Subscription.upcoming_invoice_on)} ⏰
        </p>
        <p className="mb-2">
          <span className="font-bold">Amount:</span> {formatAmount(Subscription.upcoming_invoice_amount)} 💰
        </p>
        <p className="mb-2">
          <span className="font-bold">Subscription Plan:</span> {Subscription.chargebee_plan.name} 📅
        </p>
        <p className="mb-2">
          <span className="font-bold">Plan Description:</span> {Subscription.chargebee_plan.description} ℹ️
        </p>
        <p className="mb-2">
          <span className="font-bold">Start Date:</span> {convertToUserTimeZone(Subscription.current_period_start)} 🚀
        </p>
        <p className="mb-2">
          <span className="font-bold">End Date:</span> {convertToUserTimeZone(Subscription.current_period_end)} 🏁
        </p>
      </div>
    </div>
  );
}

export default SubscriptionModal;
