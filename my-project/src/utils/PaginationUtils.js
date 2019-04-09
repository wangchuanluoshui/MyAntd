import React from "react";

export default class PaginationUtils extends React.Component {

    static pageInation(data, callback) {
            return {
            onChange: (current,pageSize) => {
                callback(current,pageSize)
            },
            current: data.data.number,
            pageSize: data.data.size,
            total: data.data.totalElements,
            showTotal: () => {
                return `共${data.data.totalElements}条，当前${data.data.number}页`
            },
            showQuickJumper: true,
            showSizeChanger: true,
            onShowSizeChange: (current, size) => {
                callback(current, size)
            }
        }
    }
}
