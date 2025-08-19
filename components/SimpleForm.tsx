import {StyleSheet, View, Text, TouchableOpacity, TextInput} from 'react-native';
import { useState, useEffect } from "react";

export default function SimpleForm({title, onSubmit, onCancel}) {
    const [nameInputValue, setNameInputValue] = useState('');
    const [descriptionInputValue, setDescriptionInputValue] = useState('');

    const returnFormData=()=> {
        onSubmit({name: nameInputValue, description: descriptionInputValue})
    }

    useEffect(() => {
        return () => {
            setDescriptionInputValue('')
            setNameInputValue('')
        };
    }, []);

    return (
                <View style={styles.formContainer}>
                    <Text style={styles.listTitle}>{title}</Text>
                    <View style={styles.textInputContainer}>
                        <Text style={styles.textInputLabel}>Name:</Text>
                        <TextInput
                            style={styles.textInput}
                            value={nameInputValue}
                            onChangeText={text => setNameInputValue(text)}
                            placeholder="Name"
                        />
                    </View>
                    <View style={styles.textInputContainer}>
                        <Text style={styles.textInputLabel}>Description:</Text>
                        <TextInput
                            value={descriptionInputValue}
                            style={styles.textInput}
                            onChangeText={text => setDescriptionInputValue(text)}
                            placeholder="Description"
                        />
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
                        <TouchableOpacity>
                            <Text style={styles.continueButton} onPress={onCancel}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.continueButton} onPress={returnFormData}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
    );
}

const styles = StyleSheet.create({
    listTitle: {
        fontWeight: "bold",
        fontSize: 24,
        fontFamily: "DMSansBold",
        marginBottom: 3,
        color: '#333333',
        textAlign: 'center'
    },
    formContainer: {
        margin: 20,
    },
    continueButton: {
        borderWidth: 2,
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginTop: 10,
        marginBottom: 30,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",

    },
    textInputContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        margin: 10,
    },
    textInputLabel: {
        fontSize: 24,
        marginRight: 5,
    },
    textInput: {
        fontSize: 18,
    },

});
