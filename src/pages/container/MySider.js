import React, {Component} from 'react';
import {Menu} from 'antd';
import {withRouter} from 'react-router-dom';
import menu from '../../config/menuList';
import tabs from '../tabs';

class MySider extends Component {

  state = {
    collapsed: false
  };

  renderMenu = (menu) => {
    if (Array.isArray(menu)) {
      return menu.map(item => {
        if (!item.children || !item.children.length) {
          return (
            <Menu.Item key={item.key || item.name}>
              <div onClick={() => this.addPane(item)}>
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Menu.Item>
          );
        } else {
          return (
            <Menu.SubMenu key={item.key} title={<span>{item.icon}<span>{item.name}</span></span>}>
              {this.renderMenu(item.children)}
            </Menu.SubMenu>
          );
        }
      });
    }
  };

  addPane = (item) => {
    const panes = this.props.panes.slice();
    const activeMenu = item.key;
    if (!panes.find(i => i.key === activeMenu)) {
      panes.push({
        name: item.name,
        key: item.key,
        content: tabs[item.key] || item.name
      });
    }
    this.props.onChangeState({
      panes,
      activeMenu
    });
  };


  render() {

    // let path = this.props.location.pathname;
    // console.log(path)
    const {activeMenu} = this.props;

    return (
      <div>
        <div style={styles.logo}/>
        <Menu theme="dark" mode="inline" selectedKeys={[activeMenu]}>
          {this.renderMenu(menu)}
        </Menu>
      </div>
    );
  }
}

const styles = {
  logo: {
    height: 32,
    background: 'rgba(255, 255, 255, .2)',
    margin: 16
  }
};


export default withRouter(MySider);
