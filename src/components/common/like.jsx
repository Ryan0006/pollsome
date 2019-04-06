import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as likedHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as likeHeart } from "@fortawesome/free-regular-svg-icons";

const getLikeClass = liked => {
  if (liked) return likedHeart;
  else return likeHeart;
};

const Like = ({ liked, onClick }) => {
  return (
    <FontAwesomeIcon
      onClick={onClick}
      icon={getLikeClass(liked)}
      style={{ cursor: "pointer", marginRight: 5 }}
      size="1x"
      aria-hidden="true"
    />
  );
};

export default Like;
