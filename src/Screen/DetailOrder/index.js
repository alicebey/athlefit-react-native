import {
    FlatList,
    Linking,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useState } from 'react';
import Text from '../../Component/Text';
import styles from './styles';
import Image from '../../Component/Image';
import { AirbnbRating } from 'react-native-ratings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../../Component/Button';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { currencyFormatter } from '../../Utils/CurrencyFormatter';
import firestore from '@react-native-firebase/firestore';
import { useSessionStore } from '../../Service/sessionStore';
import LoadingHelper from '../../Utils/LoadingHelper';
import AlertModal from '../../Component/AlertModal';

const DummyHours = [
    {
        value: 1,
    },
    {
        value: 2,
    },
    {
        value: 3,
    },
];

const DetailOrder = ({ route }) => {
    const data = route.params.data;
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [selectedHours, setSelectedHours] = useState(1);

    const { username, user_id } = useSessionStore();


    if (data === undefined) {
        return null;
    }

    const openGps = () => {
        const scheme = Platform.OS === 'android' ? 'geo:' : 'maps:';
        const url =
            scheme +
            `${data.location_map.latitude},${data.location_map.longitude}?q=${data.location_name}`;
        Linking.openURL(url);
    };

    const renderHours = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                disabled
                onPress={() => setSelectedHours(item.value)}
                style={[
                    styles.duration,
                    item.value === data.duration && styles.selectedDuration,
                ]}>
                <Text type="regular" size={16} color={item.value == data.duration ? '#52B788' : '#F8F9FA'}>
                    {item.value} Hours
                </Text>
            </TouchableOpacity>
        );
    };
    console.log(data, 'data');

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.image,
                    data.image_url === undefined && { alignItems: 'center' },
                ]}>
                <Icon
                    onPress={() => navigation.goBack()}
                    name={'arrow-back'}
                    style={styles.back}
                    size={25}
                    color={'#FFF'}
                />
                <Image
                    source={
                        data.image_url
                            ? { uri: data.image_url }
                            : require('../../Assets/field.png')
                    }
                />
            </View>
            <View style={styles.body}>
                <View style={styles.title}>
                    <Text type="bold" size={36}>
                        {data.location_name}
                    </Text>
                </View>
                <View style={styles.address}>
                    <Icon
                        name={'place'}
                        style={{ marginRight: 5 }}
                        size={25}
                        color={'#E63946'}
                    />
                    <Text type="regular" maxWidth={'90%'} size={16}>
                        {data.location_address}
                    </Text>
                </View>

                <View style={styles.bookingName}>
                    <Text type="bold" size={16}>
                        Booking Name
                    </Text>
                    <View style={styles.name}>
                        <Text type="regular" size={14} color={'#52B788'}>
                            {username}
                        </Text>
                    </View>
                </View>

                <View style={styles.timeContainer}>
                    <TouchableOpacity
                        onPress={() => setDatePicker(true)}
                        activeOpacity={0.8}
                        disabled
                        style={styles.bookingDate}>
                        <Text type="bold" size={16}>
                            Date
                        </Text>
                        <View style={styles.date}>
                            <Text type="regular" size={16} color={'#52B788'}>
                                {moment(new Date(data.order_time.seconds * 1000)).format('DD MMM YYYY')}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setTimePickker(true)}
                        activeOpacity={0.8}
                        disabled
                        style={styles.bookingTime}>
                        <Text type="bold" size={16}>
                            Time
                        </Text>
                        <View style={styles.date}>
                            <Text type="regular" size={16} color={'#52B788'}>
                                {moment(new Date(data.order_time.seconds * 1000)).format('HH:mm')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.durationContainer}>
                    <Text type="bold" size={16}>
                        Duration
                    </Text>
                    <View style={styles.bookingDuration}>
                        <FlatList
                            data={DummyHours}
                            renderItem={renderHours}
                            keyExtractor={(_, i) => i.toString()}
                            horizontal
                        />
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                        <Text
                            type="bold"
                            style={{ marginBottom: 5 }}
                            size={16}
                            color={'#FFF'}>
                            Estimate Price
                        </Text>
                        <Text type="regular" size={16}>
                            IDR {currencyFormatter(data.total_price)}
                        </Text>
                    </View>
                    <Button
                        onPress={openGps}
                        buttonStyle={styles.button}
                        title="Maps"
                        titleColor='#52B788'
                        backgroundColor='#FFF'
                    />
                </View>
            </View>
        </View>
    );
};

export default DetailOrder;
