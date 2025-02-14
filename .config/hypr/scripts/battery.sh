#!/usr/bin/env bash

# الحصول على حالة البطارية
battery_info=$(acpi -b)
charging_status=$(echo "$battery_info" | grep -oP '(Charging|Discharging|Not charging)')
battery_percentage=$(echo "$battery_info" | grep -oP '\d+%' | tr -d '%')
show_time=15000

# تحديد مسارات الملفات الصوتية
low_battery_sound="$HOME/.config/ags/assets/audio/battery-low.mp3"
high_battery_sound="$HOME/.config/ags/assets/audio/battery-high.mp3"
critical_battery_sound="$HOME/.config/ags/assets/audio/battery-critical.mp3"

# التأكد من تعيين المتغيرات البيئية المطلوبة
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
export DBUS_SESSION_BUS_ADDRESS="${DBUS_SESSION_BUS_ADDRESS:-unix:path=$XDG_RUNTIME_DIR/bus}"

# تحديد الإشعار بناءً على حالة البطارية
if [[ $charging_status == "Discharging" ]]; then
    if [[ $battery_percentage -lt 10 ]]; then
        icon_name="battery-empty"
        message="تحذير حرج! نسبة البطارية أقل من 10%. الرجاء توصيل الشاحن فورًا لتجنيد إغلاق الجهاز."
        sound_file="$critical_battery_sound"
        notify-send -i "$icon_name" -t "$show_time" "نسبة شحن البطارية ($battery_percentage%)" "$message"
        paplay "$sound_file"
    elif [[ $battery_percentage -lt 20 ]]; then
        icon_name="battery-caution"
        message="تحذير! نسبة البطارية أقل من 20%. الرجاء توصيل الشاحن قريبًا."
        sound_file="$low_battery_sound"
        notify-send -i "$icon_name" -t "$show_time" "نسبة شحن البطارية ($battery_percentage%)" "$message"
        paplay "$sound_file"
    elif [[ $battery_percentage -lt 40 ]]; then
        icon_name="battery-low"
        message="نسبة البطارية أقل من 40%. يفضل شحن الجهاز قريبًا للحفاظ على الأداء."
        sound_file="$low_battery_sound"
        notify-send -i "$icon_name" -t "$show_time" "نسبة شحن البطارية ($battery_percentage%)" "$message"
        paplay "$sound_file"
    elif [[ $battery_percentage -lt 60 ]]; then
        icon_name="battery-good"
        message="نسبة البطارية أقل من 60%. يمكنك الاستمرار في العمل ولكن يُفضل الشحن قريبًا."
        sound_file="$low_battery_sound"
        notify-send -i "$icon_name" -t "$show_time" "نسبة شحن البطارية ($battery_percentage%)" "$message"
        paplay "$sound_file"
    fi
elif [[ $charging_status == "Charging" || $charging_status == "Not charging" ]]; then
    if [[ $battery_percentage -gt 95 ]]; then
        icon_name="battery-full"
        message="البطارية ممتلئة تقريبًا (أكثر من 95%). يُفضل فصل الشاحن للحفاظ على صحة البطارية."
        sound_file="$high_battery_sound"
        notify-send -i "$icon_name" -t "$show_time" "نسبة شحن البطارية ($battery_percentage%)" "$message"
        paplay "$sound_file"
    elif [[ $battery_percentage -gt 80 ]]; then
        icon_name="battery-full"
        message="نسبة البطارية أعلى من 80%. يُفضل فصل الشاحن قريبًا للحفاظ على صحة البطارية."
        sound_file="$high_battery_sound"
        notify-send -i "$icon_name" -t "$show_time" "نسبة شحن البطارية ($battery_percentage%)" "$message"
        paplay "$sound_file"
    fi
fi