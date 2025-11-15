// English
const EN = {
  // CP
  cp: {
    ranking: {
      tabList: [
        {
          label: "Best CP",
          value: 0,
        },
        {
          label: "Weekly Rank",
          value: 1,
        },
        {
          label: "Rewards",
          value: 2,
        },
      ],
      weekList: [
        {
          label: "Last week",
          value: 1,
        },
        {
          label: "This week",
          value: 2,
        },
      ],
      tips: {
        tab1: "The 3 pairs of CPs with the highest CP rating",
        tab2: "The list is sorted according to the value of CPs giving each other CP gifts",
        explain:
          "Hamster Live reserves the right of final explanation for this program.",
      },
    },
  },

  // Charge
  charge: {
    index: {
      honorOfCertircate: "HONOR OF CERTIRCATE",
      tabList: [
        {
          label: "Task",
          value: 0,
        },
        {
          label: "Ranking",
          value: 1,
        },
        // {
        //   label: "HALL OF HONOR",
        //   value: 2,
        // },
      ],
      dayList: [
        {
          label: "Today",
          value: 2,
        },
        {
          label: "Yesterday",
          value: 1,
        },
      ],
      rankings: {
        daily: "Daily Ranking",
        monthly: "Monthly Ranking",
      },
      tips: {
        daily: "Daily Ranking is refreshed at 0:00 (UTC +3)",
        upto: {
          20000: {
            title: "Recharge up to $20000",
            text: "Users who have recharged up to $20000 this month",
          },
          10000: {
            title: "Recharge up to $10000",
            text: "Users who have recharged up to $10000 this month",
          },
          5000: {
            title: "Recharge up to $5000",
            text: "Users who have recharged up to $5000 this month",
          },
        },
        reward: "This medal will be awarded to the TOP 1 after the event and will be valid for 30 days!",
        upgrade: "To improve your ranking you also need: ",
      },
      lv: "Lv.",
      giftPack: "Gift Packs",
      reached: "Recharge to: ",
      day: "D",
      levelingUp: "Leveling up also requires: ",
      rechargedThisMonth: "Recharged this month: ",
      coins: "coins"
    },
    certificate: {
      tips: {
        winners: "List of Honorary Certificate Winners",
      },
    },
  },

  // Recharge
  recharge: {
    index: {
      tabList: [
        {
          label: "Method",
          value: 0,
        },
        {
          label: "Reseller",
          value: 1,
        },
      ],
      langList: [
        {
          text: "Arabic",
          value: 0,
        },
        {
          text: "English",
          value: 1,
        },
      ],
      confirm: "Confirm",
      cancel: "Cancel",
      idPlaceholder: "Enter Hamster ID",
      tips: {
        checkInfo: "Please check your account information",
      },
      topup: "Top up",
    },
  },

  // Guild
  guild: {
    title: "Agency",
    applyJoin: "Join the Agency",
    applying: "In the application",
    agencyInfo: "Agency Information",
    agencyStar: "Star of the Agency",
    founder: {
      nick: "Founder",
      uid: "Founder ID",
    },
    btn: {
      create: "Create",
      search: "Search",
      createAgency: "Create Agency",
      reject: "Reject",
      consent: "Consent",
      cancel: "Cancel",
      confirm: "Confirm",
      remove: "Remove",
    },
    monthlyData: "Monthly Data",
    myCard: "My Agency Card",
    topRoom: "Top 10 Room",
    tips: {
      nodata: "No data",
      enterName: "Please enter the Agency name",
      enterId: "Please enter the user ID",
      dissolveAgency:
        "Once dissolved and unable to be restored, is the dissolution confirmed?",
      quitAgency:
        "Withdrawing from the guild may affect the salary settlement this time. At the same time, in order to standardize the anchor management rules and avoid malicious withdrawal from the guild, a fee of 1000 gold coins is required to withdraw from the guild. Are you sure you want to withdraw from the guild?",
      searchUid: "Search user ID",
    },
    label: {
      totalIncome: "Total income",
      totalHours: "Total hours",
      totalValidDays: "Total Valid days",
      hours: "Hours",
      validDays: "Valid days",
      validDay: "Valid day",
      joinTime: "Time to join Agency",
      lastLoginTime: "Last login time",
      cover: "Agency Cover",
      name: "Agency Name",
      todayIncome: "Today’s income",
      yesterdayIncome: "Yesterday’s income",
      thisMonthIncome: "This monthly income",
      thisMonthHours: "This monthly hours",
      thisMonthDays: "This monthly days",
      lastMonthIncome: "Last monthly income",
      lastMonthHours: "Last monthly hours",
      lastMonthDays: "Last monthly days",
    },
    unit: {
      date: "Date",
      days: "Days",
      hours: "Hours",
      income: "Income",
    },
    more: {
      information: "Information",
      invite: "Invite",
      order: "Order",
      withdraw: "Withdraw",
      dissolve: "Dissolve",
      cancel: "Cancel",
      quit: "Quit",
    },
    message: "Message",
    dissolveAgency: "Dissolve Agency",
    quitAgency: "Quit Agency",
  },

  // Other
  other: {
    finishedText: "No more content available",
    pullingText: "Pull down to refresh...",
    loosingText: "Release to refresh...",
    loadingText: "Loading...",
  },
  Reseller: {
    // 页面标题
    Agent: 'Agent',
    OrderProcessing: 'Order Processing',

    // 用户信息
    Username: 'Username',
    UserId: 'User ID',

    // 操作按钮
    TransferCoin: 'Transfer Coin',
    TransferToReseller: 'Transfer to Reseller',

    // 转账统计
    TransferToday: 'Transfer Today',
    TransferThisWeek: 'Transfer This Week',
    TransferThisMonth: 'Transfer This Month',
    TransferLastMonth: 'Transfer Last Month',

    // 转账记录
    Record: 'Record',
    NoMoreRecords: 'No more records',
    TransferCoins: 'Transfer Coins',

    // 转账相关
    TransferSuccessful: 'Transfer successful',
    TransferFailed: 'Transfer failed',
    NotResellerUser: 'This user is not a reseller',

    // 退出登录确认
    LogoutTitle: 'Logout Confirmation',
    ConfirmLogout: 'Do you want to logout?',

    // 订单页面
    OrderProcessingTitle: 'Order Processing',

    // 筛选选项
    Pending: 'Pending',
    InProgress: 'In Progress',
    Completed: 'Completed',
    Declined: 'Declined',
    Unknown: 'Unknown',

    // 订单字段
    WithdrawalMethod: 'Withdrawal Method',
    WithdrawalAmount: 'Withdrawal Amount',
    AnticipatedIncome: 'Anticipated Income',
    OrderTime: 'Order Time',
    ViewInWithdrawCenter: 'View in withdraw center',

    // 弹窗
    SelectMonth: 'Select Month',
    Cancel: 'Cancel',
    Confirm: 'Confirm',

    // 状态文本
    LoadFailed: 'Load failed, click to retry',
    Loading: 'Loading...',
    NoMoreData: 'No more data',
    NoOrderData: 'No order data',
    NotAvailable: 'N/A',

    // 通用
    USD: 'USD',
    Diamond: 'Diamond',
    Gold: 'Gold',

    // 图片alt属性
    Back: 'Back',
    Selected: 'Selected',
    NotSelected: 'Not Selected',
    ChannelIcon: 'Channel Icon',
    Arrow: 'Arrow',
    NoData: 'No Data',
  },
  Agency: {
    // 提现相关
    Withdraw: 'Withdraw',
    WithdrawMethods: 'Withdrawal Methods',
    WithdrawalMethod: 'Withdrawal Method',
    SelectWithdrawalMethod: 'Select Withdrawal Method',
    Agent: 'Agent',
    SelectAgent: 'Select Agent',
    Amount: 'Amount',
    Balance: 'Balance',
    EnterAmount: 'Enter Amount',
    WithdrawAll: 'Withdraw All',
    Processing: 'Processing',
    Saving: 'Saving...',
    Confirm: 'Confirm',
    Cancel: 'Cancel',

    // 表单字段
    AccountID: 'Account ID',
    EnterAccountID: 'Enter Account ID',
    RecipientName: 'Recipient Name',
    EnterRecipientName: 'Enter Recipient Name',
    WhatsAppNumber: 'WhatsApp Number',
    EnterWhatsAppNumber: 'Enter WhatsApp Number',
    UserId: 'User ID',

    // 错误提示
    PleaseSelectWithdrawMethod: 'Please select a withdrawal method',
    PleaseEnterAccountID: 'Please enter account ID',
    PleaseEnterRecipientName: 'Please enter recipient name',
    PleaseEnterWhatsAppNumber: 'Please enter WhatsApp number',
    PleaseSelectAgent: 'Please select an agent',
    PleaseSelectValidAgent: 'Please select a valid agent',
    AgentInfoIncomplete: 'Agent information is incomplete',
    PleaseEnterValidAmount: 'Please enter a valid amount',
    AmountCannotExceed: 'Amount cannot exceed {max}',
    AmountCannotExceedBalance: 'Amount cannot exceed your balance',

    // 确认对话框
    ConfirmWithdraw: 'Confirm Withdrawal',
    ConfirmWithdrawMessage: 'Confirm withdrawal of {amount} diamonds ({usdAmount} USD) to agent {agentName} via {method}?',
    WithdrawRequestSubmitted: 'Withdrawal request submitted successfully',

    // 订单相关
    OrderDetail: 'Order Detail',
    Pending: 'Pending',
    InProgress: 'In Progress',
    Declined: 'Declined',
    Completed: 'Completed',
    LoadingOrders: 'Loading...',
    NoMoreOrders: 'No more orders',
    WithdrawalMethod: 'Withdrawal Method',
    OrderID: 'Order ID',
    OrderTime: 'Order Time',
    AccountID: 'Account ID',
    RecipientName: 'Recipient Name',
    WhatsAppNumber: 'WhatsApp Number',
    PaymentReceipt: 'Payment Receipt',
    Contact: 'Contact',
    PaymentReceived: 'Payment Received',
    UploadedOn: 'Uploaded on',
    OrderIDCopied: 'Order ID copied',
    AccountIDCopied: 'Account ID copied',
    WhatsAppNumberCopied: 'WhatsApp number copied',
    PaymentConfirmedSuccessfully: 'Payment confirmed successfully',
    FailedToConfirmPayment: 'Failed to confirm payment',
    FailedToLoadOrders: 'Failed to load orders',

    // 其他
    Unknown: 'Unknown',
  },
  transfer: {
    title: 'Transfer Coin',
    checkUserId: 'Please check the user ID you are transferring to',
    search: 'Search',
    unknownUser: 'Unknown User',
    userIdPrefix: 'ID:',
    enterAmount: 'Please enter the amount you want to transfer',
    balance: 'Balance:',
    max: 'Max',
    min: 'Min',
    attention:
      "The coins will be transferred to the herovoice's account, you can not cancel it after the transaction was done, please sure you transfer to the correct account.",
    transferring: 'Transferring...',
    transfer: 'Transfer',
    searchUserIdPlaceholder: 'Search user ID',
    maxAmountPlaceholder: 'Max {max} for 1 time',
    minAmountPlaceholder: 'Min {min} coins required',
    minimumTransferError: 'Minimum transfer amount is {min} coins',
  },


  // 斋月
  ramadan: {
    The: "The auspicious \nMonth of Ramadan",
    Act: "Activity Gift",
    Wis: "Wishing you all a blessed Ramadan, send a gift below to celebrate Ramadan Giving a gift will earn you points corresponding to the value of the gift!",
    Cha: "Challenges",
    Ran: "Ranking",
    Rew: "Rewards",
    Cha1: "Challenge Tasks",
    Dai: "Daily sign-in",
    Roo: "Room Ranking",
    Gif: "Gift Ranking",
    Sen: "Send Gift {0}Gold",
    Go: "Go",
    Cla: "Claimed",
    Sending: 'Sending {0}',
    Get: 'Get',
    TOP: 'TOP{0}',
    flo: 'During the event period, recharge 10 knives or more every day for 7 consecutive days, you can get the reward pack at the end of the event - Premium Medal Permanent',
    Permanent: 'Permanent',
    room: 'Room Supporters',
    room1: 'Top1 Room Top3 Supporters',
    room2: 'Top2 Room Top3 Supporters',
    room3: 'Top3 Room Top3 Supporters',
  },

  // roomWeekAct
  roomWeekAct: {
    act: 'roomWeekAct',
    rule: 'rule',
    Rewards: 'Rewards',
    room: 'Room Level',
    circ: 'Circular flow',
    activ: 'Activity rules',
    my: 'My Stats',
    NoLevel: 'No Level',
    rule1: "1. The activity is valid for a long time, every Sunday's 0:00 GMT +3 - next Sunday's 0:00 GMT +3;",
    rule2: '2. The rewards obtained this week will be automatically issued to the owner of the room that meets the standard after the settlement at 0:00 GMT +3 every Sunday, please refer to the countdown at the top of the page for the settlement time;',
    rule3: '3. If any abnormal account participates in the activity, the official has the right to cancel the participation qualification of the abnormal account and cancel the issuance of rewards;',
    rule4: '4. This activity has nothing to do with Apple lce;',
    rule5: '5. If you have any questions, please contact the official administrator room ID: 10000',
    no: "You have not created a room and cannot participate in the event! Please create your room before participating in the event",
    go: 'Go create a room',
    award: 'Award prizes:',
  },

  weekActivity: {
    Wee: "Weekly Star",
    Las: "Last Week's Top 3",
    Vie: "View Wall of Honor",
    Las1: "Last Week",
    Thi: "This Week",
    Awa: "Awards",
    TOP: "TOP 1",
    TOP2: "TOP 2",
    TOP3: "TOP 3",
    Eve: "Event Rules",
    The: "1. The campaign is valid for a long period of time, Sunday's 0:00 - next Saturday's 24:00 (GMT +3) for one campaign cycle;", "Rew": "2. Rewards earned this week will be automatically distributed to the TOP 3 users in this week's list after the settlement on every Sunday at 0:00 GMT +3. Please refer to the countdown at the top of the list for the settlement time;", "Ifa": "3. If any abnormal account participates in the activity, the official has the right to cancel the participation qualification of the abnormal account and cancel the issuance of rewards;", "Thi4": "4. This activity has nothing to do with Apple lce;", "Ify": "5. If you have any questions, please contact the official administrator room ID: 10000."
  },

  sysadmin: {}
};

export default EN;
