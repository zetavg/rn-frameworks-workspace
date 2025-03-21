import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, Button, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {
  BaseNavigationContainer,
  createNavigatorFactory,
  DefaultNavigatorOptions,
  NavigationProp,
  useNavigation,
  useNavigationBuilder,
  useNavigationContainerRef,
} from "@react-navigation/core";
import {
  StackRouter,
  StackNavigationState,
  ParamListBase,
} from "@react-navigation/routers";
import { useReduxDevToolsExtension } from "@react-navigation/devtools";

import { createStackNavigator } from "@react-navigation/stack";

type SlotNavigatorOptions = {};
type StackNavigationEventMap = {};

type SlotNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  string | undefined,
  StackNavigationState<ParamListBase>,
  SlotNavigatorOptions,
  StackNavigationEventMap,
  NavigationProp<ParamListBase>
>;

function SlotNavigator(props: SlotNavigatorProps) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder(StackRouter, {
      ...props,
    });

  return (
    <DemoContainer title="Returned elements of SlotNavigator">
      <NavigationContent>
        <DemoContainer title="This is under NavigationContent">
          {descriptors[state.routes[state.index].key].render()}
        </DemoContainer>
      </NavigationContent>
    </DemoContainer>
  );
}

// const Stack = createStackNavigator();

// While Stack.Navigator is just SlotNavigator untouched, we need to do this to get Stack.Screen.
// Stack.Screen is just a static component for now, but it's not exported by @react-navigation/core, so the only way to get it is by calling this `createNavigatorFactory`.
const Stack = createNavigatorFactory(SlotNavigator)();

function Links() {
  const navigation = useNavigation();

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Button
        title="Home"
        onPress={() => {
          (navigation as any).push("Home");
        }}
      />
      <Button
        title="Foo"
        onPress={() => {
          (navigation as any).push("Foo");
        }}
      />
      <Button
        title="Bar"
        onPress={() => {
          (navigation as any).push("Bar");
        }}
      />
      <Button
        title="SubStack"
        onPress={() => {
          (navigation as any).push("SubStack");
        }}
      />
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Links />
    </View>
  );
}

function FooScreen({ route }) {
  const nav = useNavigation();
  console.log("FooScreen render, root state from globalNavigationRef currently is", globalNavigationRef?.current?.getRootState(), 'state from navigation currently is', nav.getState());
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Foo Screen, route: ${JSON.stringify(route)}</Text>
      <Links />
    </View>
  );
}

function BarScreen({ route }) {
  const nav = useNavigation();
  console.log("BarScreen render, root state from globalNavigationRef currently is", globalNavigationRef?.current?.getRootState(), 'state from navigation currently is', nav.getState());
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Bar Screen, route: ${JSON.stringify(route)}</Text>
      <Links />
    </View>
  );
}

function SubStack({ route }) {
  return (
    <DemoContainer title={`SubStack ${JSON.stringify(route)}`}>
      <Stack.Navigator id={undefined}>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
        <Stack.Screen name="SubStack" component={SubSubStack} />
      </Stack.Navigator>
    </DemoContainer>
  );
}

function SubSubStack({ route }) {
  return (
    <DemoContainer title={`SubSubStack ${JSON.stringify(route)}`}>
      <Stack.Navigator id={undefined}>
        <Stack.Screen name="Foo" component={FooScreen} />
        <Stack.Screen name="Bar" component={BarScreen} />
      </Stack.Navigator>
    </DemoContainer>
  );
}

function RootStack() {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Foo" component={FooScreen} />
      <Stack.Screen name="Bar" component={BarScreen} />
      <Stack.Screen name="SubStack" component={SubStack} />
    </Stack.Navigator>
  );
}

// const linking = {
//   prefixes: [
//     /* your linking prefixes */
//   ],
//   config: {
//     /* configuration for matching screens with paths */
//   },
// };

let globalNavigationRef: any = null

export default function App() {
  const navigationRef = useNavigationContainerRef<ParamListBase>();

  globalNavigationRef = navigationRef

  useReduxDevToolsExtension(navigationRef);

  return (
    <View>
      <BaseNavigationContainer
        ref={navigationRef}
        // linking={linking}
        theme={DefaultTheme}
      >
        <RootStack />
        <Button
          onPress={() => {
            const state = navigationRef.getRootState();
            console.log(state);
            navigationRef.current?.dispatch({ ...ACTION, target: state.key });
          }}
          title="Dispatch Action"
        />
        <Button
          onPress={() => {
            const state = navigationRef.getRootState();
            console.log(state);
            navigationRef.current?.dispatch({ ...ACTION_2, target: state.key });
          }}
          title="Dispatch Action 2"
        />
        <Text>Press "Dispatch Action" and then "Dispatch Action 2", see logs in console, see latest "BarScreen render", root state and state didn't match, root state isn't updated yet as the deepest "routes" has only one element but state already have two. This is why usePathname (using root state) in One have potential bug since the screen can render before the batch update of root store hasn't complete.</Text>
      </BaseNavigationContainer>
    </View>
  );
}

/**
 * This component provides no functionality but to make it easier to see what's going on.
 */
function DemoContainer(props: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <Text>{props.title}</Text>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderWidth: 1, borderColor: "black", margin: 8, padding: 8 },
});

const ACTION = {
  type: "NAVIGATE",
  target: "",
  payload: {
    // key: "undefined-TZH2a27tw658mAiA91VUZ",
    name: "SubStack",
    params: {
      screen: "SubStack",
      params: {
        screen: "Foo",
        params: { foo: "params for foo" },
      },
    },
  },
};

const ACTION_2 = {
  type: "NAVIGATE",
  target: "",
  payload: {
    // key: "undefined-TZH2a27tw658mAiA91VUZ",
    name: "SubStack",
    params: {
      screen: "SubStack",
      params: {
        screen: "Bar",
        params: { bar: "params for bar" },
      },
    },
  },
};
