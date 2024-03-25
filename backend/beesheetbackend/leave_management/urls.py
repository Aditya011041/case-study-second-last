from django.contrib import admin
from django.urls import path
from . views import CancelLeaveApplication, LeaveApplicationAll, LeaveApplicationList, LeaveSummaryDetail , LeaveTypeDetail, ManagerLeave, ManagerLeaveApplicationCreate, ManagerLeaveApplicationList, SuperuserManagerLeave, SuperuserStatusChangeView ,  ViewDetails , EmployeeApplicationList,LeaveSummaryData

urlpatterns = [
    path('leaveapplicationlist/' , LeaveApplicationList.as_view()),
    path('leaveapplicationlist/<int:pk>/', LeaveApplicationList.as_view()),
    path('leaveapplication/<int:leave_app_id>/', SuperuserStatusChangeView.as_view()),
    path('leaveapplicationlist/manager/<int:manager_Id>/', ManagerLeaveApplicationList.as_view()),
    path('leaveSummary/<int:pk>/', LeaveSummaryDetail.as_view()),
    path('leaveTypeDetail/', LeaveTypeDetail.as_view()),
    path('leaveTypeDetail/<int:pk>', LeaveTypeDetail.as_view()),
    path('view-emp-details/<int:pk>/' , ViewDetails.as_view()),
    path('emp-leave-details/<int:emp_id>/' , EmployeeApplicationList.as_view()),
    path('leaveapplicationlist/manager/<int:managerId>/<int:leave_app_id>/', LeaveApplicationList.as_view(), name='update_leave_application'),
    path('cancel-leave-application/employee/<int:empId>/<int:leave_app_id>/' , CancelLeaveApplication.as_view()),
    path('all-leave-application/', LeaveApplicationAll.as_view()),
    path('leave-counts/<int:emp_id>/' , LeaveSummaryData.as_view()),
    path('manager-leave-create/<int:manager_Id>/', ManagerLeaveApplicationCreate.as_view()),
    path('manager-leave-all/', ManagerLeaveApplicationCreate.as_view()),
    path('manager-leave/<int:leave_app_id>/', SuperuserManagerLeave.as_view()),
    path('manager-leave-applications/<int:manager_Id>/', ManagerLeave.as_view()),

]
