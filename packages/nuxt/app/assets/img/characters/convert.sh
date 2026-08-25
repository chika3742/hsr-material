for file in *_small.png; do
    magick "$file" -crop 175x175+0+0 "$file"
done

for file in *.png; do
    echo "$file"
    cwebp -q 80 "$file" -o "${file%.png}.webp" > /dev/null
    rm "$file"
done
