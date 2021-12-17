cat data/feeds.json | grep feedUrl | sed  's/"feedUrl"://g' | cut -d '"' -f2 > /tmp/feeds.txt
while read URL; do
    $GITHUB_WORKSPACE/scripts/corstest.sh $URL
    if [ $? -eq 0 ]; then
        # Nothing...
        sleep 0
    else
        echo "FAIL: $URL"
        exit 1
    fi
done < /tmp/feeds.txt;