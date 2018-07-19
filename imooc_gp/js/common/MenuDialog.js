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

export default class MenuDialog extends Component {
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
        const {onClose, menus, onSelect, theme} = this.props;
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

                    {menus.map((result, i, array) => {
                        let menu = array[i];
                        return <TouchableOpacity
                            key={i}
                            onPress={() => onSelect(array[i])}
                            underlayColor={'transparent'}
                        >
                            <View style={{alignItems: 'center', flexDirection: 'row'}}>

                                <Image
                                    style={[styles.icon, theme.styles.tabBarSelectedIcon]}
                                    source={menu.icon}
                                    resizeMode={'stretch'}

                                />
                                <Text style={styles.text}>{menu.name}</Text>
                            </View>

                            {i !== array.length - 1 ? <View style={styles.line}/> : null}

                        </TouchableOpacity>
                    })}

                </View>

            </TouchableOpacity>

        </Modal>);
    }
}

MenuDialog.propTypes = {
    menus: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    theme: PropTypes.object,
    onClose: PropTypes.func
}

MenuDialog.defaultProps = {
    menus: [],
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'flex-end'
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
        marginRight: 18,
        resizeMode: 'contain'
    },
    text: {
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
        paddingRight: 15
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