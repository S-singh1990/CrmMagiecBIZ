import { View, TextInput, Image } from 'react-native'
import React from 'react'

const CustomTextInput = ({
    mt,
    placeholder,
    onChangeText,
    isValid,
    value,
    icon
}) => {
    return (
        <View style={{
            width: '100%',
            height: 50,
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: isValid ? '898989' : '#f00',
            borderRadius: 20,
            marginTop: mt ? mt : 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 15,
        }}>
            {icon && (
                <Image
                    source={icon}
                    style={{ width: 20, height: 20, tintColor: '#9e9e9e' }}
                />
            )}
            <TextInput
                onChangeText={txt => {
                    onChangeText(txt);
                }}
                value={value}
                style={{ width: '100%', color: '#000' }}
                placeholder={placeholder}
                placeholderTextColor="#9e9e9e"
            />
        </View>
    )
}

export default CustomTextInput