import axios from 'axios';
import { notification,message } from "antd";

const openNotificationWithIcon = (type, message, description, close) => {
    let durTime = 3;
    if (!close) {
        durTime = null;
    }
    notification[type]({
        message: message,
        description: description,
        duration: durTime,
        placement: 'bottomRight'
    });
};

const baseUri="/api/";


export default class index {

    static getRequest(options) {
        console.log(options.data.params);
        return new Promise((resolve, reject) => {
            axios({
                url: baseUri+options.url,
                method: 'get',
                timeout: 5000,
                params: (options.data && options.data.params) || ''
            }).then((response) => {
                if (response.status == '200') {
                    let res = response.data;
                    if (res.code == '0000') {
                        resolve(res);
                    } else {
                        console.log(res);
                        openNotificationWithIcon('error', '失败', res.msg, false);
                        reject(res);
                    }
                } else {
                    reject(response.data);
                }
            });
        });
    }

    static postRequest(options) {
        console.log(baseUri+options.url);
        console.log(options.data);
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: baseUri+options.url,
                data: options.data
            }).then((response) => {
                console.log(response);
                if (response.status == '200') {
                    let res = response.data;
                    if (res.code == '0000') {
                        openNotificationWithIcon('success', '成功', res.msg, true);
                        resolve(res);
                    } else {
                        console.log(res);
                        openNotificationWithIcon('error', '失败', res.msg, false);
                        reject(res);
                    }
                } else {
                    console.log(response.data);
                    reject(response.data);
                }
            }).catch((error,response) => {
                message.error('服务器异常！');
                console.log("error：" + response);
            });
        });
    }


    static deleteRequest(options) {
        console.log(options.url + options.id.data);
        return new Promise((resolve, reject) => {
            axios({
                url: baseUri+options.url + options.id.data,
                method: 'delete',
                timeout: 5000,
            }).then((response) => {
                if (response.status == '200') {
                    let res = response.data;
                    if (res.code == '0000') {
                        resolve(res);
                    } else {
                        console.log(res);
                        openNotificationWithIcon('error', '失败', res.msg, false);
                        reject(res);
                    }
                } else {
                    reject(response.data);
                }
            });
        });
    }

    static putRequest(options) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'put',
                url: baseUri+options.url,
                data: options.data
            }).then((response) => {
                if (response.status == '200') {
                    let res = response.data;
                    if (res.code == '0000') {
                        openNotificationWithIcon('success', '成功', res.msg, true);
                        resolve(res);
                    } else {
                        console.log(res);
                        openNotificationWithIcon('error', '失败', res.msg, false);
                        reject(res);
                    }
                } else {
                    reject(response.data);
                }
            });
        });
    }
}