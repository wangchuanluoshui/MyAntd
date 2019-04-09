import React from "react";

export default class DataTransferUtils extends React.Component {

    static transferUserRole(role) {

        let roles = {
            'minister': '部长',
            'member': '成员',
            'admin': '管理员',
        }
        return roles[role];
    }

}