/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    DeviceEventEmitter
} from 'react-native';
import {ACTION_HOME} from './HomePage';

export default class BaseComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme
        }
    }

    componentDidMount() {
        this.baseListener = DeviceEventEmitter.addListener('ACTION_BASE',
            (action, params) => {
                this.onBaseAction(action, params)
            });
    }

    onBaseAction(action, params) {
        if (action === ACTION_HOME.A_THEME) {
            if (!params) return;
            this.setState({
                theme: params
            })

        }
    }

    componentWillUnmount() {
        // 这种写法等价于：if(this.baseListener) this.baseListener.remove();
        this.baseListener && this.baseListener.remove();
    }

}
