import React from "react";

interface RestartButtonProps {
  gameOver: boolean;
  hasWon: boolean;
  isPressed: boolean;
  onRestart: () => void;
}

const RestartButton: React.FC<RestartButtonProps> = ({
  gameOver,
  hasWon,
  isPressed,
  onRestart,
}) => {
  const getImageSrc = (): string => {
    if (isPressed) return "./wow.png";
    if (hasWon) return "./cools.png";
    if (gameOver) return "./dead.png";
    return "./smile1.png";
  };

  const getImageStyle = (): React.CSSProperties => {
    return isPressed ? { width: "45px", padding: "20px" } : { width: "90px" };
  };

  return (
    <button className="restartButton" onClick={onRestart}>
      <img src={getImageSrc()} alt="smile" style={getImageStyle()} />
    </button>
  );
};

export default RestartButton;
