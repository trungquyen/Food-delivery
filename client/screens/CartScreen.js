import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { featured } from '../constants'
import { themeColors } from '../theme';
import * as Icon from "react-native-feather";
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectRestaurant } from '../slices/restaurantSlice';
import { removeFormCart, selectCartItems, selectCartTotal } from '../slices/cartSlice';
import { urlFor } from '../sanity';

export default function CartScreen() {
    const restaurant = useSelector(selectRestaurant);
    const navigation = useNavigation();
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const cartDeliver = 10;
    const [groupedItems, setGroupedItems] = useState({});
    const dispatch = useDispatch();

    useEffect(()=>{
      const items = cartItems.reduce((group, item)=>{
        if(group[item._id]){
          group[item._id].push(item);
        }else{
          group[item._id] = [item];
        }
        return group;
      },{})
      setGroupedItems(items);
    },[cartItems])

    const orderButton = ()=> {
      if(!groupedItems.length){
        navigation.goBack();
      }else{
        navigation.navigate('OrderPrepairing');
      }
    }
  return (
    <View className="bg-white flex-1">
      {/* back button */}
      <View className="relative py-4 shadow-sm">
        <TouchableOpacity
            onPress={()=> navigation.goBack()}
            style={{backgroundColor: themeColors.bgColor(1)}}
            className="absolute z-10 rounded-full p-1 shadow top-5 left-2"
        >
            <Icon.ArrowDown strokeWidth={3} stroke="white"/>
        </TouchableOpacity>
        <View>
          <Text className="text-center font-bold text-xl">Your Cart</Text>
          <Text className="text-center text-gray-500">{restaurant.name}</Text>
        </View>
      </View>

      {/* delivery time */}
      <View 
        style={{backgroundColor: themeColors.bgColor(0.2)}}
        className="flex-row px-4 items-center"
      >
        <Image source={require('../assets/images/bikeGuy.png')} className="w-20 h-20 rounded-full"/>
        <Text className="flex-1 pl-4">Deliver in 20-30 minutes</Text>
        <TouchableOpacity>
          <Text className="font-bold" style={{color: themeColors.text}}>
            Change
          </Text>
        </TouchableOpacity>
      </View>
      {/* dishes */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50
        }}
        className="bg-white pt-5"
      >
        {
          Object.entries(groupedItems).map(([key, items])=>{
            let dish = items[0];
            return (
              <View key={key}
                className="flex-row items-center space-x-3 py-2 px-4 bg-white rounded-3xl mx-2 mb-3 shadow-md">
                  <Text className="font-bold" style={{color: themeColors.text}}>
                    {items.length} x
                  </Text>
                  <Image className="w-14 h-14 rounded-full" source={{uri: urlFor(dish.image).url()}}/>
                  <Text className="flex-1 font-bold text-gray-700">{dish.name}</Text>
                  <Text className="font-semibold text-base">{dish.price}.000VNĐ</Text>
                  <TouchableOpacity
                    onPress={()=> dispatch(removeFormCart({id: dish._id}))}
                    className="p-1 rounded-full"
                    style={{backgroundColor: themeColors.bgColor(1)}}
                  >
                    <Icon.Minus strokeWidth={2} height={20} width={20} stroke="white"/>
                  </TouchableOpacity>
              </View>
            )
          })
        }
      </ScrollView>
      {/* total */}
      <View style={{backgroundColor: themeColors.bgColor(0.2)}} className="p-6 px-8 rounded-t-3xl space-y-4">
        <View className="flex-row justify-between">
          <Text className="text-gray-700">Subtotal</Text>
          <Text className="text-gray-700">{cartTotal}.000VNĐ</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-700">Deliver fee</Text>
          <Text className="text-gray-700">{cartDeliver}.000VNĐ</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-700">Order Total</Text>
          <Text className="text-gray-700">{cartTotal + cartDeliver}.000VNĐ</Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={()=> navigation.navigate('OrderPrepairing')}
            style={{backgroundColor: themeColors.bgColor(1)}}
            className="p-3 rounded-full"
          >
            <Text className="text-white text-center font-bold text-xl">
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}