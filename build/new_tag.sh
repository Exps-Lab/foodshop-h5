#!/usr/local/bin/bash

# 使用demo：
# 1. 使用默认name和message
# npm run tag
# 2. 自定义tagMessage
# npm run tag tagMessage
# 3. 自定义name和message
# npm run tag tagName tagMessage
#
# tagName默认值：当前"年月日时分秒"
# tagMessage默认值："new Tag"

tagName=`date "+%Y%m%d%H%M%S"`
tagMessage="newTag"
standardTagBranch=("master")
nowBranch="$(git rev-parse --abbrev-ref HEAD)"

# 处理带颜色输出
# $1:颜色 $2:输出信息
function colorEcho() {
  declare -A colorMap=(
    ["red"]="31"
    ["green"]="32"
    ["yellow"]="33"
    ["blue"]="34"
    ["purple"]="35"
  )
  echo -e "\e[${colorMap["$1"]}m $2 \e[0m"
}

### tag前判断以及参数合并
# 保证在"master","release","test"分支上打tag
[[ "${standardTagBranch[@]}" =~ $nowBranch ]]
if [ $? -ne 0 ]; then
  colorEcho red 请切换到${standardTagBranch[*]}分支上再执行tag操作
  exit 0
fi

# 处理传递参数
if [ $# -eq 1 ]; then
  tagMessage=$1
elif [ $# -gt 1 ]; then
  tagName=$1
  tagMessage=$2
fi


###################
### 开始处理tag ####
###################
colorEcho purple "---开始生成tag...---"

git tag -a $tagName -m $tagMessage
if [ $? -ne 0 ]; then
  colorEcho red "[err] tag生成错误, 请根据错误提示修改tagMessage"
else
  colorEcho blue "[done] tag已经生成: "
  colorEcho blue "[info] name: $tagName"
  colorEcho blue "[info] message: $tagMessage"

  colorEcho purple "---开始上传tag...---"
  git push origin $tagName
  if [ $? -ne 0 ]; then
    colorEcho red "[err] tag push失败, 请尝试链接vpn后重试"
  else
     colorEcho blue "[done] tag已上传gitlab"
  fi
fi
