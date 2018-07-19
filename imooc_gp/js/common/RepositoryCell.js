import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

export default class RepositoryCell extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../res/images/ic_star.png') :
                require('../../res/images/ic_unstar_transparent.png'),
            theme:this.props.theme
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setFavoriteState(nextProps.projectModel.isFavorite);
    }

    /**
     * 点击收藏按钮
     */
    onPressFavorite() {
        let isFavorite = !this.state.isFavorite;
        this.setFavoriteState(isFavorite);
        // 告诉PopularPage.js页面，将更新后的数据保存到数据库
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);

    }

    /**
     * 更新收藏图标的状态
     * @param isFavorite
     */
    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') :
                require('../../res/images/ic_unstar_transparent.png')
        })
    }

    render() {
        let data = this.props.projectModel.item;
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={this.props.onSelect}>
                <View style={styles.cellContainer}>
                    <Text style={styles.title}>{data.full_name}</Text>
                    <Text style={styles.description}>{data.description}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text>Author:</Text>
                            <Image style={{width: 22, height: 22}} source={{url: data.owner.avatar_url}}/>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text>Stars:</Text>
                            <Text>{data.stargazers_count}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                this.onPressFavorite();
                            }}
                        >
                            <Image style={[{width: 22, height: 22}, this.props.theme.styles.tabBarSelectedIcon]}
                                   source={this.state.favoriteIcon}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontSize: 16,
        color: '#212121'
    },
    description: {
        fontSize: 12,
        color: '#757575'
    },
    cellContainer: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderWidth: 0.5,
        borderRadius: 3,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1
    }
})