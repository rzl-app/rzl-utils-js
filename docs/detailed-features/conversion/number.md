### Docs Conversion `rzl-utils-js`   
  #### 🚀 Number Conversion Utils Helpers

  <table>
    <thead>
      <tr>
        <th style="text-align: left"><small>Function</small></th>
        <th style="text-align: left"><small>Description</small></th>
        <th style="text-align: left"><small>Props / Usage</small></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <code><small>formatPhoneNumber()</small></code>
        </td>
        <td>
          <small>
            Overloaded function to format, validate, or extract numbers from phone
            strings.<br />
            Returns <code>string</code> or <code>boolean</code> based on props.
          </small>
        </td>
        <td>
          <small>
            ✅ <code>takeNumberOnly: true</code> → digits<br />
            ✅ <code>checkValidOnly: true</code> → boolean<br />
            ✅ Normal → formatted phone string
          </small>
        </td>
      </tr>
      <tr>
        <td>
          <code><small>formatNumberWithSeparator()</small></code>
        </td>
        <td>
          <small>
            Adds separators every 3 digits.<br />
            Works with integers, decimals, and customizable separator chars.
          </small>
        </td>
        <td>
          <small>
            <code>formatNumberWithSeparator(1000000)</code> → <code>"1,000,000"</code><br />
            <code>formatNumberWithSeparator(1234567.89, " ")</code> →
            <code>"1 234 567.89"</code>
          </small>
        </td>
      </tr>
    </tbody>
  </table>

  #### ⚡ Quick Example TypeScript/JavaScript (with type support):

    ```ts
    import { formatPhoneNumber,formatNumberWithSeparator } from "rzl-utils-js";

    // ✅ Example 1: Format phone number to string
    const ex1 = formatPhoneNumber({
      value: "+628123456789",
    });
    console.log(ex1);
    // Output: "(+62) 812 3456 789"

    // ✅ Example 2: Extract digits only
    const ex2 = formatPhoneNumber({
      value: "+62 812-3456-789",
      takeNumberOnly: true,
    });
    console.log(ex2);
    // Output: "628123456789"

    // ✅ Example 3: Validate phone format only (returns boolean)
    const ex3 = formatPhoneNumber({
      value: "+62 812 3456 789",
      checkValidOnly: true,
    });
    console.log(ex3);
    // Output: true or false

    // ✅ Example 4: Custom separator & country style
    const ex4 = formatPhoneNumber({
      value: "+62 8123456789",
      separator: "-",
      openingNumberCountry: "[",
      closingNumberCountry: "]",
    });
    console.log(ex4);
    // Output: "[+62] 812-3456-789"

    // ✅ Example 5: Format large number with custom separator
    const ex5 = formatNumberWithSeparator(987654321, " ");
    console.log(ex5);
    // Output: "987 654 321"
    ```

---

[⬅ Back](https://github.com/rzl-app/rzl-utils-js?tab=readme-ov-file#detailed-features--conversion-currency)

---
