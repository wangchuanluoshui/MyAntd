import React from "react";
import {notification} from "antd";

export default class ICommon extends React.Component {

    static openNotificationWithIcon = (type, message,description,close) => {
        let durTime=4.5;
        if(!close)
        {
            durTime=null;
        }
        notification[type]({
            message: message,
            description: description,
            duration:durTime
        });
    };
}
