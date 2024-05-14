import { View, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';

const CustomTextPasswordInput = ({
    mt,
    placeholder,
    onChangeText,
    isValid,
    value,
    icon,
    iconeye,
    iconeyeOff
}) => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };
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
                style={{ width: '85%', color: '#000' }}
                placeholder={placeholder}
                placeholderTextColor="#9e9e9e"
                secureTextEntry={secureTextEntry}
            />
            {secureTextEntry ? (
                <TouchableOpacity onPress={toggleSecureEntry}>
                    {iconeye && (
                        <Image
                            source={iconeye}
                            style={{ width: 20, height: 20, tintColor: '#9e9e9e' }}
                        />
                    )}
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={toggleSecureEntry}>
                    {iconeyeOff && (
                        <Image
                            source={iconeyeOff}
                            style={{ width: 20, height: 20, tintColor: '#9e9e9e' }}
                        />
                    )}
                </TouchableOpacity>
            )}
        </View>
    )
}


export default CustomTextPasswordInput