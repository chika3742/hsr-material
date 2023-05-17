for file in *.webp; do
  if [[ $file =~ _small.webp$ ]]; then
    convert "$file" -crop 175x175+0+0 "$file"
  fi
done