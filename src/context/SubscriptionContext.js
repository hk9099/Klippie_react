import React, { createContext, useContext, useState } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [Subscription, setSubscription] = useState();
  const [PlanSubscribed, setPlanSubscribed] = useState(false);

 

  return (
    <SubscriptionContext.Provider value={{  Subscription, setSubscription , PlanSubscribed, setPlanSubscribed ,subscribed, setSubscribed}}>
      {children}
    </SubscriptionContext.Provider>
  );
};
