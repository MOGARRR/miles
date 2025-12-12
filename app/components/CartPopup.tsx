"use client"

type CartPopupProps = {
  onClose: () => void
}; 


const CartPopup = ({ onClose }: CartPopupProps) => {
  return (
    <div>
      <p> Mini cart popup placeholder</p>

      {/* When clicked, call the parent's close function */}
      <button onClick={onClose}>
        Close

      </button>
    </div>
  )
};

export default CartPopup;
