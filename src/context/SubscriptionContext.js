import React, { createContext, useContext, useState } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState();
  const [Subscription, setSubscription] = useState();

  const subscribe = (status) => {
    setIsSubscribed(status);
  }

  return (
    <SubscriptionContext.Provider value={{ isSubscribed, subscribe , Subscription, setSubscription}}>
      {children}
    </SubscriptionContext.Provider>
  );
};
