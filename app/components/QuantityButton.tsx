"use client";

import React from "react";
import { useState } from "react";

interface quantityButtonProps {
  amount: number;
  classInfo: string;
}

const quantityButton: React.FC<quantityButtonProps> = ({amount, classInfo}) => {
  const [quantity, setQuantity] = useState(amount || 0);
  const handleButtons = (type: boolean) => {
    type
      ? setQuantity((prev) => prev + 1)
      : quantity <= 0
      ? setQuantity(0)
      : setQuantity((prev) => prev - 1);
  };
  return (
    <div>
      <button className={classInfo} onClick={() => handleButtons(false)}>-</button>
      <span className={classInfo}>{quantity}</span>
      <button className={classInfo} onClick={() => handleButtons(true)}>+</button>
    </div>
  );
};

export default quantityButton;
