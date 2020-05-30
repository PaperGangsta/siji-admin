import {SET_WEBSOCKET, SET_ONLINELIST, ADD_CHAT, SET_CHATLIST} from './constants';
import {notification, Avatar} from 'antd';
import {getChatList} from '../api/chat';
import {replaceImg} from '../utils/util';
import React from 'react';

export function setWebsocket(websocket) {
  return {
    type: SET_WEBSOCKET,
    websocket
  };
}

export function initWebSocket(user) {    //初始化websocket对象
  return async function (dispatch) {
    const websocket = new WebSocket('ws://' + window.location.hostname + ':8081');
    //建立连接时触发
    websocket.onopen = function () {
      const data = {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      };
      //当用户第一次建立websocket链接时，发送用户信息到后台，告诉它是谁建立的链接
      websocket.send(JSON.stringify(data));
    };
    //监听服务端的消息事件
    websocket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      //在线人数变化的消息
      if (data.type === 0) {
        dispatch(setOnlinelist(data.msg.onlineList));
        data.msg.text && notification.info({
          message: '提示',
          description: data.msg.text
        });
      }
      //聊天的消息
      if (data.type === 1) {
        dispatch(addChat(data.msg));
        notification.open({
          message: data.msg.username,
          description: <div style={{wordBreak: 'break-all'}}
                            dangerouslySetInnerHTML={{__html: replaceImg(data.msg.content)}}/>,
          icon: <Avatar src={data.msg.userAvatar}/>
        });
      }
      console.log(11, data);
    };
    dispatch(setWebsocket(websocket));
    dispatch(initChatList());
  };
}

export function setOnlinelist(onlineList) {
  return {
    type: SET_ONLINELIST,
    onlineList
  };
}

export function initChatList() {
  return async function (dispatch) {
    const res = await getChatList();
    dispatch(setChatList(res.data || []));
  };
}

export function setChatList(chatList) {
  return {
    type: SET_CHATLIST,
    chatList
  };
}

export function addChat(chat) {
  return {
    type: ADD_CHAT,
    chat
  };
}
