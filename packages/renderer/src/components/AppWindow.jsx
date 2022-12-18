// @ts-nocheck
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Layout, Menu } from "antd";
import { BsFullscreen } from "react-icons/bs";
import { BiLibrary } from "react-icons/bi";
import { MdMovie } from "react-icons/md";
import { RiMovieLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import {
  SettingOutlined,
  CloseOutlined,
  MinusOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import RouteConfig from "../config/RouteConfig";
import { useEffect } from "react";

const { Header, Content, Footer, Sider } = Layout;

const TitleBarHeight = "35px";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  {
    label: <NavLink to={"/"}>Home</NavLink>,
    key: "home",
    icon: <HomeOutlined />,
  },
  {
    label: <NavLink to={"/library"}>Library</NavLink>,
    key: "library",
    icon: <BiLibrary />,
  },
  {
    label: <NavLink to={"/movie"}>Movie</NavLink>,
    key: "movies",
    icon: <MdMovie />,
  },
  {
    label: <NavLink to={"/tv"}>TV Series</NavLink>,
    key: "series",
    icon: <RiMovieLine />,
  },
  {
    label: <NavLink to={"/anime/movie"}>Anime Movies</NavLink>,
    key: "animemovie",
    icon: <MdMovie />,
  },
  {
    label: <NavLink to={"/anime/tv"}>Anime Series</NavLink>,
    key: "animeseries",
    icon: <RiMovieLine />,
  },
  {
    label: <NavLink to={"/WatchTogether"}>Watch Together</NavLink>,
    key: "watchtogether",
    icon: <FiUsers />,
  },
  {
    label: <NavLink to={"/settings"}>Settings</NavLink>,
    key: "settings",
    icon: <SettingOutlined />,
    // children: [
    //     {
    //         type: 'group',
    //         label: 'Item 1',
    //         children: [
    //             {
    //                 label: 'Option 1',
    //                 key: 'setting:1',
    //             },
    //             {
    //                 label: 'Option 2',
    //                 key: 'setting:2',
    //             },
    //         ],
    //     },
    //     {
    //         type: 'group',
    //         label: 'Item 2',
    //         children: [
    //             {
    //                 label: 'Option 3',
    //                 key: 'setting:3',
    //             },
    //             {
    //                 label: 'Option 4',
    //                 key: 'setting:4',
    //             },
    //         ],
    //     },
    // ],
  },
];

function MainUI() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener("navigate", (e) => {
      navigate(e.detail.path);
    });
  }, []);

  return (
    <AppContainer>
      <TitleBar>
        <AppTitle>MMDM</AppTitle>
        <TitleBarIcon
          id="minimizeBtn"
          onClick={() => {
            electron.topButtonApi.updateWindow("minimizeApp");
          }}
        >
          <MinusOutlined style={{ fontSize: "18px" }} />
        </TitleBarIcon>
        <TitleBarIcon
          id="maxResBtn"
          onClick={() => {
            electron.topButtonApi.updateWindow("toggleMaximizeApp");
          }}
        >
          <BsFullscreen style={{ fontSize: "14px" }} />
        </TitleBarIcon>
        <TitleBarIcon
          id="closeBtn"
          onClick={() => {
            electron.topButtonApi.updateWindow("closeApp");
          }}
        >
          <CloseOutlined style={{ fontSize: "18px" }} />
        </TitleBarIcon>
      </TitleBar>
      <ContentWrapper>
        <Sider
          collapsible
          collapsed={collapsed}
          style={{ height: "100%" }}
          onCollapse={() => setCollapsed(!collapsed)}
        >
          {/* <div className="logo" /> */}
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <AppContent>
          <RouteConfig />
        </AppContent>
      </ContentWrapper>
    </AppContainer>
  );
}

const TitleBar = styled.div`
  height: ${TitleBarHeight};
  background-color: #1f1f1f;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  > button {
    outline: none;
    border: none;
    background-color: #1f1f1f;
    cursor: pointer;
    transition: 0.2s;

    :hover {
      background-color: #141414;
    }

    :active {
      background-color: #1890ff;
    }
  }
`;

const AppTitle = styled.div`
  width: 100%;
  -webkit-app-region: drag;
  padding: 10px;
`;

const TitleBarIcon = styled.button`
  width: ${TitleBarHeight};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AppContainer = styled.div`
  height: 100vh;
`;

const ContentWrapper = styled.div`
  height: calc(100vh - ${TitleBarHeight});
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
`;

const AppContent = styled.div`
  height: calc(100vh - ${TitleBarHeight});
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  overflow: overlay;
`;

export default MainUI;
