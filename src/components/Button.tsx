import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Text, StyleSheet, Platform } from 'react-native'

interface ButtonProps extends TouchableOpacityProps {
    title: string;
}

export function Button( { title, ...rest }:ButtonProps ){
    return (
        <TouchableOpacity style={styles.button} activeOpacity={0.7} {...rest}
        >
            <Text style={styles.buttonText}>
              {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#0d8bc8',
        padding: Platform.OS == 'ios' ? 15 : 10,
        borderRadius: 7,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
})