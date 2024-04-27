import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import TopNavigator from '../Components/TopNavigator';

const CallLog = () => {

    return (
        <View style={styles.container}>
            <TopNavigator />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
});

export default CallLog