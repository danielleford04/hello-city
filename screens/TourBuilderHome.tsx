import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState } from "react";
import {denverRoute1, cbusRoute1, denverRoute2} from '@/sampleRoute';
import RouteListItem from "@/components/RouteListItem";
import SimpleForm from "@/components/SimpleForm";
import {Tour} from "@/utilities/types";

const defaultRoutes = [denverRoute1, cbusRoute1, denverRoute2]

interface TourBuilderHomeProps {
    openMapBuilderWithSelectedTour: (Tour)=>void;
}

export default function TourBuilderHome({openMapBuilderWithSelectedTour} : TourBuilderHomeProps) {
    const [routes, setRoutes] = useState<Tour[] | null>(defaultRoutes)
    const [displayNewTourBasicForm, setDisplayNewTourBasicForm] = useState<boolean>(false)

    return (
        <>
                {!displayNewTourBasicForm && routes &&
                    <View>
                        <View style={styles.createButtonContainer}>
                            <TouchableOpacity style={styles.createButton} onPress={() => setDisplayNewTourBasicForm(true)}>
                                <Text style={styles.createButtonText}>Create New Tour</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.listTitle}>Drafts</Text>
                        <View style={styles.tourListContainer}>
                            {routes.map((route, index) => (
                                <RouteListItem route={route} onPress={()=>openMapBuilderWithSelectedTour(route)} key={route.id} />
                            ))}
                        </View>
                    </View>
                }
                {displayNewTourBasicForm &&
                    <SimpleForm title={"Create a New Tour"} onSubmit={openMapBuilderWithSelectedTour} onCancel={()=>setDisplayNewTourBasicForm(false)}/>
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
    tourListContainer: {
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
