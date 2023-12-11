#!/bin/sh

cd ~/px4_ros_ws/src

git clone https://github.com/JOCIIIII/ROS2-Algorithm.git

cd ~/px4_ros_ws

colcon build --symlink-install --packages-select msg_srv_act_interface
colcon build --symlink-install --packages-select common_interfaces
colcon build --symlink-install --packages-select sensor_msgs_py
colcon build --symlink-install --packages-select a4vai

source ~/px4_ros_ws/install/local_setup.zsh