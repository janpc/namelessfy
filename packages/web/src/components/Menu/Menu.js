import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import { signOut } from "../../redux/auth/auth-actions";
import { getFavorites, getMySongs } from "../../redux/song/song-actions";

import { userSelector } from "../../redux/user/user-selectors";
import { songSelector } from "../../redux/song/song-selectors";
import { playlistSelector } from "../../redux/playlist/playlist-selectors";

import { hasUserAllInfo } from "../../utils/utils";

import {
  Background,
  Back,
  ColumnDiv,
  RowDiv,
  MenuImage,
  UserNameMenu,
  CloseContainer,
  FullName,
  MediaContainer,
} from "./style";
import { DeleteButton, CenterContent } from "../../styles/formStyles";
import { Icon } from "../../styles/mainStyles";

import PlaylistPreviewMenu from "../PlaylistPreviewMenu";
import RowPlaylist from "../RowPlaylist";
import MenuPlaylistList from "../MenuPlaylistList";

function Menu({ show, close }) {
  const dispatch = useDispatch();
  const User = useSelector(userSelector);
  const { myPlaylists } = useSelector(playlistSelector);
  const { favorites, mySongs } = useSelector(songSelector);
  const [hasAllInfo, setHasAllInfo] = useState(false);
  const [hasMySongs, setHasMySongs] = useState(false);

  useEffect(() => {
    if (hasAllInfo && !hasMySongs) {
      dispatch(getMySongs());
    }
  }, [hasAllInfo, hasMySongs]);

  useEffect(() => {
    if (mySongs) {
      setHasMySongs(true);
    }
  }, [mySongs]);

  useEffect(() => {
    if (hasAllInfo) {
      dispatch(getFavorites());
    }
  }, [hasAllInfo]);

  useEffect(() => {
    setHasAllInfo(hasUserAllInfo(User.currentUser));
  }, [User.currentUser]);

  function handleSignOut() {
    dispatch(signOut());
  }

  function handleBackClick(e) {
    if (e.target.id === "back") {
      close();
    }
  }

  return (
    <>
      <Back isShowing={show} onClick={handleBackClick} id="back">
        <Background isShowing={show}>
          <CloseContainer>
            <Icon type="button" name="close" size="small" onClick={close} />
          </CloseContainer>
          <RowDiv>
            <Link to="/user-page">
              <MenuImage
                src={
                  User.currentUser.porfileImage ||
                  "https://usra-quantum.s3.amazonaws.com/assets/images/user-avatar-icon.png"
                }
              />
            </Link>
            <Link to="/user-page">
              <ColumnDiv>
                <UserNameMenu>{User.currentUser.userName}</UserNameMenu>
                <FullName>{`${User.currentUser.firstName}  ${User.currentUser.lastName}`}</FullName>
              </ColumnDiv>
            </Link>
          </RowDiv>

          <MediaContainer>
            <ColumnDiv>
              {favorites?.length > 0 && (
                <PlaylistPreviewMenu
                  title="Your favorite songs"
                  songs={favorites}
                />
              )}
            </ColumnDiv>
            <ColumnDiv>
              {favorites?.length > 0 && (
                <PlaylistPreviewMenu title="Liked Songs" songs={favorites} />
              )}
            </ColumnDiv>
            <ColumnDiv>
              {myPlaylists?.length > 0 && (
                <MenuPlaylistList
                  playlists={myPlaylists}
                  title="My Playlists"
                />
              )}
            </ColumnDiv>{" "}
            <DeleteButton type="button" onClick={handleSignOut} lastItem>
              Sign Out
            </DeleteButton>
          </MediaContainer>
        </Background>
      </Back>
    </>
  );
}

Menu.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default Menu;
