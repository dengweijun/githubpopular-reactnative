import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    DeviceInfo
} from 'react-native';
import PropTypes from 'prop-types';
import TimeSpan from '../model/TimeSpan';

export const timeSpanArray = [new TimeSpan('今 天', 'since=daily'),
    new TimeSpan('本 周', 'since=weekly'),
    new TimeSpan('本 月', 'since=monthly')];
export default class TrendingDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    show() {
        this.setState({
            visible: true
        })
    }

    dismiss() {
        this.setState({
            visible: false
        })
    }

    render() {
        const {onClose, onSelect} = this.props;
        return (<Modal
            transparent={true}
            visible={this.state.visible}
            onRequestClose={() => onClose()}
        >

            <TouchableOpacity
                style={styles.container}
                onPress={() => this.dismiss()}
            >

                <Image
                    style={styles.arrow}
                    source={require('../../res/images/arrow_down.png')}/>

                <View
                    style={styles.content}
                >

                    {timeSpanArray.map((result, i, array) => {
                        return <TouchableOpacity
                            key={i}
                            onPress={() => onSelect(array[i])}
                            underlayColor={'transparent'}
                        >
                            <View style={{alignItems: 'center'}}>

                                <Text style={styles.text}>{array[i].showText}</Text>
                                {i !== array.length - 1 ? <View style={styles.line}/> : null}
                            </View>

                        </TouchableOpacity>
                    })}

                </View>

            </TouchableOpacity>

        </Modal>);
    }
}

TrendingDialog.propTypes = {
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center'
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 3,
        paddingTop: 3,
        paddingBottom: 3,
        marginRight: 3
    },
    arrow: {
        marginTop: 56 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0),
        width: 16,
        height: 16,
        resizeMode: 'contain'
    },
    text: {
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
        padding: 8,
        paddingLeft: 26,
        paddingRight: 26
    },
    line: {
        backgroundColor: 'darkgray',
        height: 0.5
    },
    icon: {
        width: 16,
        height: 16,
        margin: 10,
        marginLeft: 15
    }
});