import React from 'react';
import {
  Modal,
  Table,
  TreeSelect,
  Divider,
  InputNumber,
  DatePicker,
  Dropdown,
  Menu,
  Row,
  Col,
  Tag,
  Popconfirm,
  Badge,
  Button,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Collapse,
  Radio,
  Popover,
  Avatar,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Iaxios from '../../axios/index';
import PaginationUtils from '../../utils/PaginationUtils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
const Panel = Collapse.Panel;
const { Description } = DescriptionList;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

function onChange(value) {
  console.log('changed', value);
}

function handleChange(value) {
  console.log(`selected ${value}`);
}
export default class SysWork extends React.Component {
  //初始化方法
  componentDidMount() {
    const { dispatch } = this.props;
    this.findRequest();
  }

  findRequest = () => {
    let _this = this;
    Iaxios.getRequest({
      url: 'user/currentUser/',
      data: {},
    })
      .then(res => {
        console.log(res.data);
        this.setState({
          sysUser: res.data,
        });
      })
      .catch(error => {
        console.log('error' + error);
      });
  };

  //变量
  state = {
    sysUser: {
      userName: '',
      phone: '',
      email: '',
      portrait: '',
      description: '',
      orgName: '',
      address: '',
    },
  };

  handleSave = () => {
    console.log('提交');
  };

  render() {
    return (
      <PageHeaderWrapper title="工作统计" style={{ float: 'center' }}>
        <Card bordered={false}>
          <div style={{ textAlign: 'center' }}>
            <Avatar
              shape="circle"
              size={100}
              src="http://192.168.141.196:8764/spring-api/file/?filePath=E:/eclipse2018/SummitHPS/file/20190420181018191/timg.jpg"
            />
          </div>
          <DescriptionList
            size="large"
            title={this.state.sysUser.userName}
            style={{ marginBottom: 32 }}
          >
            <Description term="邮箱">{this.state.sysUser.email}</Description>
            <Description term="驻地">{this.state.sysUser.address}</Description>
            <Description term="部门">{this.state.sysUser.orgName}</Description>
          </DescriptionList>
          <Collapse>
            <Panel showArrow={false} header="点我告诉你一个秘密！" key="1">
              <p>{this.state.sysUser.description}</p>
            </Panel>
          </Collapse>
          <Divider style={{ marginBottom: 10 }} />
          <RadioGroup defaultValue="水利运维平台" size="large">
            <RadioButton value="水利运维平台" style={{ marginRight: 10 }}>
              水利运维平台
            </RadioButton>
            <RadioButton value="水文测验安全生产监管平台" style={{ margin: 10 }}>
              水文测验安全生产监管平台
            </RadioButton>
            <RadioButton value="数据转移模块" style={{ margin: 10 }}>
              数据转移模块
            </RadioButton>
          </RadioGroup>
          <Divider style={{ marginBottom: 10 }} />
          <TextArea placeholder="当前工作内容" autosize />
          <Divider style={{ marginBottom: 10 }} />
          <div>
            <span>预计时长：</span>
            <InputNumber min={1} max={100000} defaultValue={1} onChange={onChange} />
            <span style={{ marginLeft: 200 }}>
              工作类型：
              <Select
                defaultValue="开发"
                style={{ width: 120, float: 'center' }}
                onChange={handleChange}
              >
                <Option value="会议">会议</Option>
                <Option value="开发">开发</Option>
                <Option value="部署">部署</Option>
                <Option value="讨论">讨论</Option>
                <Option value="其他">其他</Option>
              </Select>
            </span>
            <Button
              type="primary"
              ghost
              icon="plus"
              onClick={this.handleSave}
              style={{ float: 'right' }}
            >
              提交工作
            </Button>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
