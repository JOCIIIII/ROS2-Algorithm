import sys
import time
import matplotlib.pyplot as plt
import numpy as np
import math

#   ROS2 python 
import rclpy
from rclpy.node import Node
from rclpy.qos_event import SubscriptionEventCallbacks
from rclpy.parameter import Parameter
from rclpy.qos import QoSDurabilityPolicy
from rclpy.qos import QoSHistoryPolicy
from rclpy.qos import QoSProfile
from rclpy.qos import QoSReliabilityPolicy
from rclpy.qos import qos_profile_sensor_data

from px4_msgs.msg import TimesyncStatus
from msg_srv_act_interface.srv import CollisionAvoidanceSetpoint


class CollisionAvoidanceService(Node):
    def __init__(self):
        super().__init__('collision_avoidance_service')
        self.qosProfileGen()
        self.TimesyncSubscriber_ = self.create_subscription(TimesyncStatus, '/px4_001/fmu/out/timesync_status', self.TimesyncCallback, self.QOS_PX4)
        self.declare_service_client_custom()
        self.timestamp = 0
        
    def declare_service_client_custom(self): 
        self.CollisionAvoidanceServiceClient_ = self.create_client(CollisionAvoidanceSetpoint, 'collision_avoidance')
        while not self.CollisionAvoidanceServiceClient_.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Collision Avoidance not available, waiting again...') 
 
    def qosProfileGen(self):
        #   Reliability : 데이터 전송에 있어 속도를 우선시 하는지 신뢰성을 우선시 하는지를 결정하는 QoS 옵션
        #   History : 데이터를 몇 개나 보관할지를 결정하는 QoS 옵션
        #   Durability : 데이터를 수신하는 서브스크라이버가 생성되기 전의 데이터를 사용할지 폐기할지에 대한 QoS 옵션
        self.QOS_Sub_Sensor = QoSProfile(
            reliability=QoSReliabilityPolicy.RELIABLE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=5,
            durability=QoSDurabilityPolicy.VOLATILE)
        
        self.QOS_Service = QoSProfile(
            reliability=QoSReliabilityPolicy.RELIABLE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=10,
            durability=QoSDurabilityPolicy.VOLATILE)
        self.QOS_PX4 = qos_profile = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=5)
        
    def RequestCollisionAvoidance(self):
        print(" Request Collision service in ")
        self.collision_avoidance_request = CollisionAvoidanceSetpoint.Request()
        self.collision_avoidance_request.request_timestamp = self.timestamp
        self.collision_avoidance_request.request_collisionavoidance = True
        self.future = self.CollisionAvoidanceServiceClient_.call_async(self.collision_avoidance_request)


    def TimesyncCallback(self, msg):
        self.timestamp = msg.timestamp
