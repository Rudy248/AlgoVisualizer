"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const algorithms = {
  "Bubble Sort":
    "Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order. This algorithm is not suitable for large data sets as its average and worst-case time complexity are quite high. Time Complexity: O(n^2) average and worst case, O(n) best case.",
  "Selection Sort":
    "Selection Sort is a comparison-based sorting algorithm. It sorts an array by repeatedly selecting the smallest (or largest) element from the unsorted portion and swapping it with the first unsorted element. Time Complexity: O(n^2) in all cases.",
  "Insertion Sort":
    "Insertion sort is a simple sorting algorithm that works by iteratively inserting each element of an unsorted list into its correct position in a sorted portion of the list. Time Complexity: O(n^2) average and worst case, O(n) best case.",
  "Merge Sort":
    "Merge sort is a sorting algorithm that follows the divide-and-conquer approach. It works by recursively dividing the input array into smaller subarrays and sorting those subarrays then merging them back together to obtain the sorted array. Time Complexity: O(n log n) in all cases.",
  "Quick Sort":
    "QuickSort is a sorting algorithm based on the Divide and Conquer that picks an element as a pivot and partitions the given array around the picked pivot by placing the pivot in its correct position in the sorted array. Time Complexity: O(n log n) average and best case, O(n^2) worst case.",
};

type AlgorithmType =
  | "Bubble Sort"
  | "Selection Sort"
  | "Insertion Sort"
  | "Merge Sort"
  | "Quick Sort";

type SortFunction = (array: number[]) => void;

const SortingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [customValues, setCustomValues] = useState("");
  const [speed, setSpeed] = useState(50);
  const [sorting, setSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmType | null>(null);

  const resetArray = useCallback(() => {
    if (sorting) return;
    const newArray = Array.from(
      { length: 20 },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setSortedIndices([]);
    setActiveIndices([]);
  }, [sorting]);

  useEffect(() => {
    resetArray();
  }, []);

  const handleCustomValues = () => {
    const values = customValues
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n));
    if (values.length) {
      setArray(values);
      setSortedIndices([]);
      setActiveIndices([]);
    }
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleSort = async (
    sortFunction: SortFunction,
    algorithmName: string
  ) => {
    setSelectedAlgorithm(algorithmName as AlgorithmType);
    await sortFunction(array);
  };

  const bubbleSort = async (array: number[]) => {
    if (sorting) return;
    setSorting(true);
    const arr = [...array];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(speed);
        }
      }
      setSortedIndices((prev) => [...prev, arr.length - i - 1]);
    }
    setSortedIndices([...Array(arr.length).keys()]);
    setSorting(false);
  };

  const selectionSort = async (array: number[]) => {
    if (sorting) return;
    setSorting(true);
    const arr = [...array];
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        setActiveIndices([minIndex, j]);
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      setArray([...arr]);
      await sleep(speed);
      setSortedIndices((prev) => [...prev, i]);
    }
    setSortedIndices([...Array(arr.length).keys()]);
    setSorting(false);
  };

  const insertionSort = async (array: number[]) => {
    if (sorting) return;
    setSorting(true);
    const arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;
      setActiveIndices([i]);
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
        setArray([...arr]);
        await sleep(speed);
      }
      arr[j + 1] = key;
      setArray([...arr]);
      await sleep(speed);
    }
    setSortedIndices([...Array(arr.length).keys()]);
    setSorting(false);
  };

  const mergeSort = async (array: number[]) => {
    if (sorting) return;
    setSorting(true);
    const sorted = await mergeSortHelper(array);
    setArray(sorted);
    setSortedIndices([...Array(sorted.length).keys()]);
    setSorting(false);
  };

  const mergeSortHelper = async (array: number[]): Promise<number[]> => {
    if (array.length <= 1) return array;
    const mid = Math.floor(array.length / 2);
    const left = await mergeSortHelper(array.slice(0, mid));
    const right = await mergeSortHelper(array.slice(mid));
    return await merge(left, right);
  };

  const merge = async (left: number[], right: number[]): Promise<number[]> => {
    const result: number[] = [];
    let i = 0,
      j = 0;

    while (i < left.length && j < right.length) {
      setActiveIndices([i, j]);
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
      await sleep(speed);
    }
    while (i < left.length) result.push(left[i++]);
    while (j < right.length) result.push(right[j++]);
    setArray([...result]);
    return result;
  };

  const quickSort = async (array: number[]) => {
    if (sorting) return;
    setSorting(true);
    const sorted = await quickSortHelper(array);
    setArray(sorted);
    setSortedIndices([...Array(sorted.length).keys()]);
    setSorting(false);
  };

  const quickSortHelper = async (array: number[]): Promise<number[]> => {
    if (array.length <= 1) return array;
    const pivotIndex = Math.floor(array.length / 2);
    const pivot = array[pivotIndex];
    const left: number[] = [];
    const right: number[] = [];
    for (let i = 0; i < array.length; i++) {
      setActiveIndices([i, pivotIndex]);
      if (i === pivotIndex) continue;
      if (array[i] < pivot) {
        left.push(array[i]);
      } else {
        right.push(array[i]);
      }
      await sleep(speed);
    }
    const sortedLeft = await quickSortHelper(left);
    const sortedRight = await quickSortHelper(right);
    return [...sortedLeft, pivot, ...sortedRight];
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        <Button onClick={resetArray} disabled={sorting}>
          Generate Random
        </Button>
        <input
          type="text"
          value={customValues}
          onChange={(e) => setCustomValues(e.target.value)}
          placeholder="Enter values: e.g, 10,20,30"
          className="border p-2"
        />
        <Button onClick={handleCustomValues} disabled={sorting}>
          Set Values
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => handleSort(bubbleSort, "Bubble Sort")}
          disabled={sorting}
        >
          Bubble Sort
        </Button>
        <Button
          onClick={() => handleSort(selectionSort, "Selection Sort")}
          disabled={sorting}
        >
          Selection Sort
        </Button>
        <Button
          onClick={() => handleSort(insertionSort, "Insertion Sort")}
          disabled={sorting}
        >
          Insertion Sort
        </Button>
        <Button
          onClick={() => handleSort(mergeSort, "Merge Sort")}
          disabled={sorting}
        >
          Merge Sort
        </Button>
        <Button
          onClick={() => handleSort(quickSort, "Quick Sort")}
          disabled={sorting}
        >
          Quick Sort
        </Button>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span>Sorting Speed</span>
        <Slider
          min={10}
          max={200}
          value={[210 - speed]}
          onValueChange={(val) => setSpeed(210 - val[0])}
          disabled={sorting}
        />
      </div>
      <div className="flex items-end gap-1 h-64">
        {array.map((value, idx) => (
          <motion.div
            key={idx}
            className={`w-6 rounded relative ${
              sortedIndices.includes(idx)
                ? "bg-green-500"
                : activeIndices.includes(idx)
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
            initial={{ height: 0 }}
            animate={{ height: `${value * 2}px` }}
            transition={{ duration: 0.2 }}
          >
            <span className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 text-sm">
              {value}
            </span>
          </motion.div>
        ))}
      </div>
      {selectedAlgorithm && (
        <div className="mt-4 p-4 border rounded shadow-lg bg-gray-100">
          <h3 className="text-lg font-semibold">{selectedAlgorithm}</h3>
          <p>{algorithms[selectedAlgorithm as keyof typeof algorithms]}</p>
        </div>
      )}
    </div>
  );
};

export default SortingVisualizer;
