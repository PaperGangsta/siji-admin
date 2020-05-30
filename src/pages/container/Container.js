import React, {Component} from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import {Layout, Modal, message} from 'antd';
import MyContent from './MyContent';
import MyHeader from './MyHeader';
import MySider from './MySider';
// import {initWebSocket} from '../../store/actions'
// import {connect} from 'react-redux'
// import {bindActionCreators} from 'redux';
import {checkToken} from '../../api/login';
import storageUtils from '../../utils/storageUtils';
import './style.less';
import GithubOutlined from '@ant-design/icons/lib/icons/GithubOutlined';


const {Header, Sider, Content, Footer} = Layout;

// const store = connect(
//   (state) => ({ user: state.user, websocket: state.websocket }),
//   (dispatch) => bindActionCreators(initWebSocket, dispatch)
// )


class Container extends Component {

  state = {
    collapsed: false,  //侧边栏的折叠和展开
    panes: [],    //网站打开的标签页列表
    activeMenu: ''  //网站活动的菜单
  };

  _setState = (obj) => {
    this.setState(obj);
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  logout = () => {
    Modal.confirm({
      title: '确认要退出登录吗？',
      onOk: () => {
        console.log('ok');
        localStorage.removeItem('token');
      }
    });
  };


  async componentDidMount() {
    const user = storageUtils.getUser();
    if (!user.token) {
      message.warning('您的登录已过期');
      storageUtils.removeUser();
      return <Redirect to={'/login'}/>;
    } else {
      const result = await checkToken();
      const data = result.data;
      if (data.code === 0) {
        // message.success('token有效');
      } else {
        message.warning('您的登录已过期');
        storageUtils.removeUser();
        return <Redirect to={'/login'}/>;
      }
    }
  }

  render() {
    const {collapsed, panes, activeMenu} = this.state;
    return (
      <Layout style={{height: '100vh'}}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <MySider
            panes={panes}
            activeMenu={activeMenu}
            onChangeState={this._setState}/>
        </Sider>
        <Layout>
          <Header style={{padding: 0}}>
            <MyHeader
              logout={this.logout}
              collapsed={collapsed}
              onChangeState={this._setState}/>
          </Header>
          <Content>
            <MyContent
              panes={panes}
              activeMenu={activeMenu}
              onChangeState={this._setState}/>
          </Content>
          <Footer style={{textAlign: 'center', background: '#fff'}}>
            SiJi-Admin ©{new Date().getFullYear()} Created by <a
            href='https://github.com/PaperGangsta'> Ali_Ming <GithubOutlined/></a>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Container);
