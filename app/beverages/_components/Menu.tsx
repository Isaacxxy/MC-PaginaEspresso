"use client"
import React, { useEffect, useState } from 'react'
import { Drink } from '@/types/type'
import { NotebookTabsIcon, X } from 'lucide-react';
import { Playfair_Display } from "next/font/google";
import {
  Coffee,
  Apple,
  Milk,
  Leaf,
  GlassWater,
  Bean,
  Citrus,
  IceCream,
  Cherry,
  Grape,
  Banana,
  CupSoda,
  Candy,
  Egg,
  Nut,
  Wheat
} from 'lucide-react';
import { GiCoffeeBeans, GiHoneypot } from "react-icons/gi";
import { GiIceCube } from "react-icons/gi";
import { TbSalt } from "react-icons/tb";





const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const getIngredientIcon = (ingredient: string) => {
  const iconMap = {
    // Coffee-related
    espresso: <Coffee className="w-10 h-10 text-white bg-amber-700 p-2 rounded-full" />,
    coffee: <GiCoffeeBeans className="w-10 h-10 text-white bg-amber-800 p-2 rounded-full" />,
    "cold brew": <Coffee className="w-10 h-10 text-white bg-amber-900 p-2 rounded-full" />,
    "coffee bean": <GiCoffeeBeans className="w-10 h-10 text-white bg-amber-900 p-2 rounded-full" />,

    // Milk/cream 
    milk: <Milk className="w-10 h-10 text-gray-900 bg-gray-100 p-2 rounded-full" />,
    "steamed milk": <Milk className="w-10 h-10 text-gray-900 bg-gray-200 p-2 rounded-full" />,
    cream: <Milk className="w-10 h-10 text-gray-900 bg-gray-400 p-2 rounded-full" />,

    // Chocolate
    "white chocolate": <Candy className="w-10 h-10 text-gray-900 bg-amber-100 p-2 rounded-full" />,
    chocolate: <Candy className="w-10 h-10 text-white bg-yellow-800 p-2 rounded-full" />,
    cocoa: <Candy className="w-10 h-10 text-white bg-yellow-700 p-2 rounded-full" />,

    // Fruits
    "apple juice": <Apple className="w-10 h-10 text-white bg-red-500 p-2 rounded-full" />,
    "orange juice": <Citrus className="w-10 h-10 text-white bg-orange-500 p-2 rounded-full" />,
    grape: <Grape className="w-10 h-10 text-white bg-purple-500 p-2 rounded-full" />,
    berry: <Cherry className="w-10 h-10 text-white bg-red-500 p-2 rounded-full" />,
    lemon: <Citrus className="w-10 h-10 text-gray-900 bg-yellow-400 p-2 rounded-full" />,
    lime: <Citrus className="w-10 h-10 text-white bg-green-600 p-2 rounded-full" />,
    strawberry: <Cherry className="w-10 h-10 text-white bg-red-500 p-2 rounded-full" />,
    banana: <Banana className="w-10 h-10 text-gray-900 bg-yellow-300 p-2 rounded-full" />,
    mango: <Citrus className="w-10 h-10 text-white bg-orange-600 p-2 rounded-full" />,
    pineapple: <Citrus className="w-10 h-10 text-gray-900 bg-yellow-500 p-2 rounded-full" />,

    // Tea
    "black tea": <Leaf className="w-10 h-10 text-white bg-green-800 p-2 rounded-full" />,
    "green tea": <Leaf className="w-10 h-10 text-white bg-green-600 p-2 rounded-full" />,
    tea: <Leaf className="w-10 h-10 text-white bg-green-700 p-2 rounded-full" />,
    matcha: <Leaf className="w-10 h-10 text-gray-900 bg-green-500 p-2 rounded-full" />,
    chai: <Leaf className="w-10 h-10 text-white bg-amber-800 p-2 rounded-full" />,

    // Other liquids
    water: <GlassWater className="w-10 h-10 text-white bg-blue-500 p-2 rounded-full" />,
    soda: <CupSoda className="w-10 h-10 text-white bg-blue-600 p-2 rounded-full" />,
    tonic: <CupSoda className="w-10 h-10 text-white bg-blue-700 p-2 rounded-full" />,

    // Sweeteners
    honey: <GiHoneypot className="w-10 h-10 text-gray-900 bg-amber-300 p-2 rounded-full" />,
    sugar: <Candy className="w-10 h-10 text-gray-900 bg-gray-100 p-2 rounded-full" />,
    syrup: <GiHoneypot className="w-10 h-10 text-gray-900 bg-amber-200 p-2 rounded-full" />,

    // Other
    ice: <GiIceCube className="w-10 h-10 text-indigo-900 bg-blue-100 p-2 rounded-full" />,
    vanilla: <Leaf className="w-10 h-10 text-gray-900 bg-orange-200 p-2 rounded-full" />,
    caramel: <Candy className="w-10 h-10 text-gray-900 bg-amber-400 p-2 rounded-full" />,
    mint: <Leaf className="w-10 h-10 text-white bg-green-500 p-2 rounded-full" />,
    nutmeg: <Nut className="w-10 h-10 text-white bg-yellow-700 p-2 rounded-full" />,
    oat: <Wheat className="w-10 h-10 text-gray-900 bg-yellow-300 p-2 rounded-full" />,
    almond: <Nut className="w-10 h-10 text-gray-900 bg-yellow-400 p-2 rounded-full" />,
    coconut: <Nut className="w-10 h-10 text-gray-900 bg-gray-300 p-2 rounded-full" />,
    egg: <Egg className="w-10 h-10 text-gray-900 bg-yellow-100 p-2 rounded-full" />,
    salt: <TbSalt className="w-10 h-10 text-gray-900 bg-gray-200 p-2 rounded-full" />,
  };

  // Clean the ingredient string
  const cleanIngredient = ingredient.toLowerCase().trim();

  // Check for exact match first
  if (iconMap[cleanIngredient as keyof typeof iconMap]) {
    return iconMap[cleanIngredient as keyof typeof iconMap];
  }

  // Then check for partial matches
  const matchedKey = Object.keys(iconMap).find(key =>
    cleanIngredient.includes(key)
  );

  return matchedKey ? iconMap[matchedKey as keyof typeof iconMap] : <span className="w-10 h-10 text-gray-500 bg-gray-200 p-2 rounded-full">?</span>;
};


const Menu = () => {
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const fetchDrinks = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/drinks");

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setDrinks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };
  useEffect(() => {
    fetchDrinks();
  }, []);

  const groupedDrinks = drinks.reduce((acc, drink) => {
    acc[drink.category] = acc[drink.category] || [];
    acc[drink.category].push(drink);
    return acc;
  }, {} as Record<string, Drink[]>);



  return (
    <div className='w-full flex flex-col items-center justify-center mt-20 gap-20'>
      <div className='w-full flex flex-col items-center justify-center gap-10'>
        <div className='my-8 text-center space-y-4'>
          <p className='md:text-3xl text-2xl font-bold capitalize'>
            Explore Our Exquisite Selection
          </p>
          <p className='text-center text-gray-500 max-w-2xl mx-auto'>
            Discover a world of flavors with our curated menu, featuring a delightful array of beverages crafted to satisfy every palate.
          </p>
        </div>
      </div>
      {Object.entries(groupedDrinks).map(([category, drinks]) => (
        <div key={category} className='w-full my-6'>
          <h2 className='text-2xl font-bold capitalize mb-4'>{category}</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-6">
            {drinks.map(drink => (
              <div
                key={drink.id}
                onClick={() => setSelectedDrink(drink)}
                className='group relative border border-[#d29c82]/40 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col gap-[44px] cursor-pointer'
              >
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#ecd4c5]/35 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,red)]"></div>
                <img src={drink.imageUrl} alt={drink.name} className='aspect-square w-[90%] mx-auto object-cover group-hover:opacity-75 lg:aspect-auto' />
                <div className="mt-4 flex justify-between gap-5">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      <div className='cursor-pointer'>
                        <span aria-hidden="true" className="absolute inset-0 text-wrap" />
                        {drink.name}
                      </div>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{drink.description}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {(() => {
                      const medium = drink.sizes.find(s => s.size === "medium");
                      const small = drink.sizes.find(s => s.size === "small");
                      const chosen = medium ?? small;
                      return chosen ? `$${chosen.price.toFixed(2)}` : "N/A";
                    })()}
                  </p>
                </div>
                <div className='absolute top-4 right-4'>
                  <span className={`${drink.temperature === 'hot' ? 'bg-orange-200' : 'bg-indigo-200'} text-black text-xs font-bold px-2 py-1 rounded-full`}>
                    {drink.temperature.charAt(0).toUpperCase() + drink.temperature.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      ))}

      {selectedDrink && (
        <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col items-center justify-between p-4'>
            <div className="flex  justify-between items-start w-full">
              <h1 className={`hidden sm:flex items-center justify-center space-x-2 text-2xl font-bold text-center ${playfair.className}`}>Pagina & Espresso</h1>
              <button
                onClick={() => setSelectedDrink(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>
            <div className='grid grid-cols-2'>
              <div>
                <img
                  src={selectedDrink.imageUrl.replace('/drinks/output_images/', '/drinks/input_images/')}
                  alt={selectedDrink.name}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
              <div className='flex flex-col items-start p-4'>
                <div>
                  <p className='text-xs text-zinc-700 font-bold mb-1'>Beverages/{selectedDrink.category}</p>
                  <h2 className="text-2xl font-bold text-wrap w-full">{selectedDrink.name}</h2>
                  <p className='text-base font-normal'>{selectedDrink.description}</p>
                </div>
                <div className='w-full'>
                  <h3 className="font-semibold text-gray-900 text-xl uppercase mt-4">Details :</h3>
                  <div className="mt-2 text-sm text-zinc-800">
                    <div className="grid grid-cols-4 gap-4 font-medium mb-1">
                      <div className="uppercase">Size</div>
                      <div className="text-right">Price</div>
                      <div className="text-right">Sugar</div>
                      <div className="text-right">Points</div>
                    </div>
                    {selectedDrink.sizes.map((details, i) => (
                      <div key={i} className="grid grid-cols-4 gap-4">
                        <div className="uppercase">{details.size}</div>
                        <div className="text-right">${details.price.toFixed(2)}</div>
                        <div className="text-right">{details.sugarContent}g</div>
                        <div className="text-right text-zinc-500">{details.points ? `${details.points} pts` : '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-xl uppercase mt-4">Ingredients :</h3>
                  <ul className="mt-2 list-disc list-inside">
                    {selectedDrink.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-sm uppercase text-zinc-800">{ingredient}.</li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
            <div className='w-full flex justify-center items-center'>
              <div className="flex flex-wrap gap-1">
                {selectedDrink.ingredients.map((ingredient, index) => (
                  <div key={index} className="tooltip" data-tip={ingredient}>
                    {getIngredientIcon(ingredient)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


export default Menu
