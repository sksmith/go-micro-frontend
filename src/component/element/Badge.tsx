import React from 'react';

export enum BadgeSize {
    XSmall = 1,
    Small,
    Base,
    Large,
    XLarge,
}

export enum BadgeColor {
    Default = 1,
    Dark,
    Red,
    Green,
    Yellow,
    Indigo,
    Purple,
    Pink
}

export interface BadgeProperties {
    size: BadgeSize
    color: BadgeColor
    value: string
}

export const Badge = ({ size, color, value }: BadgeProperties) => {
    let className = "mr-2 px-2.5 py-0.5 rounded";

    switch (size) {
        case BadgeSize.XSmall:
            className += " text-xs font-semibold";
            break;
        case BadgeSize.Small:
            className += " text-sm font-semibold";
            break;
        case BadgeSize.Base:
            className += " text-base font-medium"
            break;
        case BadgeSize.Large:
            className += " text-lg font-medium"
            break;
        case BadgeSize.XLarge:
            className += " text-xl font-medium"
            break;
        default:
            className += " text-xs font-semibold";
    }

    switch (color) {
        case BadgeColor.Dark:
            className += " bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
            break;
        case BadgeColor.Red:
            className += " bg-red-500 text-gray-100 dark:bg-red-600 dark:text-gray-100";
            break;
        case BadgeColor.Green:
            className += " bg-green-500 text-gray-100 dark:bg-green-600 dark:text-gray-100";
            break;
        case BadgeColor.Yellow:
            className += " bg-yellow-500 text-yellow-100 dark:bg-yellow-200 dark:text-yellow-900";
            break;
        case BadgeColor.Indigo:
            className += " bg-indigo-500 text-indigo-100 dark:bg-indigo-200 dark:text-indigo-900";
            break;
        case BadgeColor.Purple:
            className += " bg-purple-500 text-purple-100 dark:bg-purple-200 dark:text-purple-900";
            break;
        case BadgeColor.Pink:
            className += " bg-pink-500 text-pink-100 dark:bg-pink-200 dark:text-pink-900";
            break;
        default:
            className += " bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }

    return (<span className={className}>{value}</span>);
}