package com.rumi.rumi_backend_v2.dto;

import com.rumi.rumi_backend_v2.enums.BillingCycle;
import com.rumi.rumi_backend_v2.enums.GenderAllowed;
import com.rumi.rumi_backend_v2.enums.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoomFilterResponse {
    private Long roomId;
    private String roomTitle;
    private String roomDescription;
    private GenderAllowed genderAllowed;
    private RoomStatus roomStatus;
    private int maxRoommates;
    private String city;
    private String country;
    private String addressLine;
    private int amount;
    private BillingCycle billingCycle;
}
```

After pasting:
        1. Press **Ctrl + S** to save
2. Press **Ctrl + K** to open commit window
3. Tick only **`RoomFilterResponse.java`**
        4. Type commit message:
        ```
feat: add RoomFilterResponse DTO