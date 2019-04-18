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
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Iaxios from '../../axios/index';
import PaginationUtils from '../../utils/PaginationUtils';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './SysUser.less';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const TreeNode = TreeSelect.TreeNode;

class SysUser extends React.Component {
  //初始化方法
  componentDidMount() {
    const { dispatch } = this.props;
    console.log('init');
    this.setState({
      dataSource: [],
    });
    this.findRequest();
  }

  //变量
  state = {
    dataSource: [],
    visiable: false,
    record: {},
    type: 'add',
    title: '',
    expandForm: false,
    treeValue: null,
  };

  params = {
    page: 1,
    size: 10,
    fieldsValue: {
      userName: '',
      status: '',
      orgName: '',
      phone: '',
    },
  };

  findRequest = () => {
    let _this = this;
    Iaxios.getRequest({
      url: 'user/',
      data: {
        params: {
          page: _this.params.page,
          size: _this.params.size,
          userName: _this.params.fieldsValue.userName,
          status: _this.params.fieldsValue.status,
          orgName: _this.params.fieldsValue.orgName,
          phone: _this.params.fieldsValue.phone,
        },
      },
    })
      .then(res => {
        res.data.content.map((item, index) => {
          item.key = index;
        });
        console.log(res.data.content);
        this.setState({
          dataSource: res.data.content,
          pagination: PaginationUtils.pageInation(res, (current, size) => {
            _this.params.page = current;
            _this.params.size = size;
            _this.findRequest();
          }),
        });
      })
      .catch(error => {
        console.log('error' + error);
      });
  };

  postRequest = data => {
    data.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (this.state.type === 'save') {
        console.log('保存用户');
        console.log(values);
        Iaxios.postRequest({
          url: 'user/',
          data: {
            userName: values.userName,
            loginName: values.loginName,
            status: values.status,
            email: values.email,
            phone: values.phone,
          },
        })
          .then(res => {
            form.resetFields();
            this.setState({
              visible: false,
            });
            this.findRequest();
          })
          .catch(error => {
            console.log('error' + error);
          });
      } else {
        console.log('修改用户');
        Iaxios.putRequest({
          url: 'user/',
          data: {
            id: values.id,
            userName: values.userName,
            loginName: values.loginName,
            status: values.status,
            email: values.email,
            phone: values.phone,
          },
        })
          .then(res => {
            form.resetFields();
            this.setState({
              visible: false,
            });
            this.findRequest();
          })
          .catch(error => {
            console.log('error' + error);
          });
      }
    });
  };

  //删除事件
  handleDelete = data => {
    console.log(data);
    Iaxios.deleteRequest({
      url: 'user/',
      id: {
        data,
      },
    })
      .then(res => {
        this.findRequest();
      })
      .catch(error => {
        console.log('error' + error);
      });
  };

  handleSave = () => {
    this.setState({
      visible: true,
      title: '新增用户',
      type: 'save',
      record: {},
    });
  };

  handleUpdate = record => {
    this.setState({
      visible: true,
      title: '编辑用户',
      type: 'update',
      record,
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      this.params.fieldsValue = fieldsValue;
      this.findRequest();
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      dataSource: [],
    });
    this.findRequest();
  };

  // 点击取消、
  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
  };
  //收起
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  onChange = treeValue => {
    console.log(treeValue);
    this.setState({ treeValue });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, title, type, record } = this.state;
    const close = true;
    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '登录名',
        dataIndex: 'loginName',
        key: 'loginName',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '所属单位',
        key: 'orgName',
        dataIndex: 'orgName',
      },
      {
        title: '邮箱',
        key: 'email',
        dataIndex: 'email',
      },
      {
        title: '当前状态',
        key: 'status',
        dataIndex: 'status',
        render(status) {
          if (status == 'true') {
            return <Badge status={'success'} text={'激活'} />;
          } else {
            return <Badge status={'error'} text={'失效'} />;
          }
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <div>
            <a onClick={() => this.handleUpdate(record)}>编辑</a>
            <Divider type="vertical" />
            <MoreBtn current={record} />
          </div>
        ),
      },
    ];

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
            <Menu.Item key="edit">编辑</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
            <Menu.Item key="accredit">授权</Menu.Item>
          </Menu>
        }
      >
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    const editAndDelete = (key, record) => {
      if (key === 'edit') this.handleUpdate(record);
      else if (key === 'delete') {
        Modal.confirm({
          title: '删除任务',
          content: '确定删除该用户吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.handleDelete(record.id),
        });
      }
    };

    return (
      <PageHeaderWrapper title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={24}>
                    <FormItem label="用户名">
                      {getFieldDecorator('userName')(
                        <Input placeholder="请输入" style={{ width: 200 }} />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem label="所属机构" style={{ float: 'right' }}>
                      {getFieldDecorator('orgName')(
                        <TreeSelect
                          showSearch
                          style={{ width: 200 }}
                          value={this.state.treeValue}
                          dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
                          placeholder="请选择"
                          allowClear
                          treeDefaultExpandAll
                          onChange={this.onChange}
                        >
                          <TreeNode value="parent 1" title="parent 1" key="0-1">
                            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
                              <TreeNode value="leaf1" title="my leaf" key="random" />
                              <TreeNode value="leaf2" title="your leaf" key="random1" />
                            </TreeNode>
                            <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
                              <TreeNode
                                value="sss"
                                title={<b style={{ color: '#08c' }}>sss</b>}
                                key="random3"
                              />
                            </TreeNode>
                          </TreeNode>
                        </TreeSelect>
                      )}
                    </FormItem>
                  </Col>
                  {/* <Col md={6} sm={24}>
                                        <FormItem label="电话" style={{ float:'right'}}>
                                            {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
                                        </FormItem>
                                    </Col>
                                    <Col md={6} sm={24}>
                                        <FormItem label="状态" style={{ float:'right'}}>
                                            {getFieldDecorator('status')(
                                                <Select style={{ width: 192 }}>
                                                    <Option value="1">激活</Option>
                                                    <Option value="0">失效</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col> */}
                  <Col md={8} sm={24}>
                    <Button type="primary" ghost icon="plus" onClick={this.handleSave}>
                      新增用户
                    </Button>
                    <Button
                      style={{ float: 'right', marginRight: 18, marginLeft: 8 }}
                      onClick={this.handleFormReset}
                    >
                      重置
                    </Button>
                    <Button
                      style={{ float: 'right', marginRight: 8 }}
                      type="primary"
                      onClick={this.handleSearch}
                    >
                      查询
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Card>
        <Table
          columns={columns}
          dataSource={this.state.dataSource}
          bordered
          pagination={this.state.pagination}
        />
        <Modal
          ref={this.showModalForm}
          title={title}
          visible={visible}
          okText="提交"
          cancelText="取消"
          onOk={this.postRequest}
          onCancel={this.handleCancel}
          closable={close}
          width="500px"
        >
          <Form>
            <Row>
              <FormItem {...formItemLayout} label="用户Id:">
                {getFieldDecorator('id', { initialValue: record.id || '' })(
                  <Input placeholder="自动生成" disabled />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem {...formItemLayout} label="用户名:" hasFeedback>
                {getFieldDecorator('userName', {
                  rules: [{ message: '请输入' }],
                  initialValue: record.userName || null,
                })(
                  <Input
                    placeholder="请输入用户名"
                    disabled={this.state.type == 'edit' ? true : false}
                  />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem {...formItemLayout} label="登录名" hasFeedback>
                {getFieldDecorator('loginName', {
                  initialValue: record.loginName || null,
                })(<Input placeholder="请输入登录名" />)}
              </FormItem>
            </Row>
            <Row>
              <FormItem {...formItemLayout} label="联系电话" hasFeedback>
                {getFieldDecorator('phone', {
                  initialValue: record.phone || null,
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Row>
            <Row>
              <FormItem {...formItemLayout} label="电子邮箱" hasFeedback>
                {getFieldDecorator('email', {
                  rules: [{ message: '请输入电子邮箱' }],
                  initialValue: record.email || null,
                })(<Input placeholder="请输入电子邮箱" />)}
              </FormItem>
            </Row>
            <Row>
              <FormItem {...formItemLayout} label="当前状态" hasFeedback>
                {getFieldDecorator('status', {
                  initialValue: record.status || '',
                })(
                  <Select style={{ width: 120 }} defaultActiveFirstOption>
                    <Option value="1">激活</Option>
                    <Option value="0">失效</Option>
                  </Select>
                )}
              </FormItem>
            </Row>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(SysUser);
