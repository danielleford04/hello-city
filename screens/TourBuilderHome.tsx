import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState } from "react";
import {denverRoute1, cbusRoute1, denverRoute2} from '@/sampleRoute';
import RouteListItem from "@/components/RouteListItem";
import SimpleForm from "@/components/SimpleForm";

const defaultRoutes = [denverRoute1, cbusRoute1, denverRoute2]

export default function TourBuilderHome({openMapBuilderWithSelectedTour}) {
    const [routes, setRoutes] = useState(defaultRoutes)
    const [displayNewTourBasicForm, setDisplayNewTourBasicForm] = useState(false)

    return (
        <>
                {!displayNewTourBasicForm &&
                    <View>
                        <View style={{justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity style={styles.createButton} onPress={() => setDisplayNewTourBasicForm(true)}>
                                <Text style={{fontWeight: "bold", fontSize: 18, color: '#3E436F'}}>Create New Tour</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.listTitle}>Drafts</Text>
                        <View style={{margin: 15}}>
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
    listTitle: {
        fontWeight: "bold",
        fontSize: 24,
        fontFamily: "DMSansBold",
        marginBottom: 3,
        color: '#333333',
        textAlign: 'center'
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
});
