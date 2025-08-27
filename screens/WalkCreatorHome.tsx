import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState } from "react";
import {denverWalk1, cbusWalk1, denverWalk2} from '@/exampleWalks';
import WalkListItem from "@/components/WalkListItem";
import SimpleForm from "@/components/SimpleForm";
import { Walk } from "@/utilities/types";

const defaultWalks = [denverWalk1, cbusWalk1, denverWalk2]

interface WalkCreatorHomeProps {
    openMapBuilderWithSelectedWalk: (Walk)=>void;
}

export default function WalkCreatorHome({openWalkCreatorMapWithSelectedWalk} : WalkCreatorHomeProps) {
    const [walks, setWalks] = useState<Walk[] | null>(defaultWalks)
    const [displayNewWalkForm, setDisplayNewWalkForm] = useState<boolean>(false)

    return (
        <>
                {!displayNewWalkForm && walks &&
                    <View>
                        <View style={styles.createButtonContainer}>
                            <TouchableOpacity style={styles.createButton} onPress={() => setDisplayNewWalkForm(true)}>
                                <Text style={styles.createButtonText}>Create New Walk</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.listTitle}>Drafts</Text>
                        <View style={styles.walkListContainer}>
                            {walks.map((walk, index) => (
                                <WalkListItem walk={walk} onPress={()=>openWalkCreatorMapWithSelectedWalk(walk)} key={walk.id} />
                            ))}
                        </View>
                    </View>
                }
                {displayNewWalkForm &&
                    <SimpleForm title={"Create a New Walk"} onSubmit={openWalkCreatorMapWithSelectedWalk} onCancel={()=>setDisplayNewWalkForm(false)}/>
                }
        </>
    );
}

const styles = StyleSheet.create({
    createButtonContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    createButton: {
        borderColor: '#3E436F',
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginVertical: 70,
        width: "60%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 15,
    },
    createButtonText: {
        fontWeight: "bold",
        fontSize: 18,
        color: '#3E436F'
    },
    walkListContainer: {
        margin: 15
    },
    listTitle: {
        fontWeight: "bold",
        fontSize: 24,
        fontFamily: "DMSansBold",
        marginBottom: 3,
        color: '#333333',
        textAlign: 'center'
    },
});
