Install MacOS:
* https://rutracker.org/forum/viewtopic.php?t=5634652
* https://www.geekrar.com/install-macos-mojave-on-vmware/
* https://github.com/DrDonk/unlocker
* sudo nano /etc/paths
    Add this line:
    ./node_modules/.bin
* // sudo nano /etc/profile
    // Add this line:
    //export PATH=./node_modules/.bin:$PATH
* Free disk space
    sudo pmset hibernatemode 0; sudo rm -f /var/vm/sleepimage
    diskutil list
    System                  16.6 GB    disk1s1
    sudo diskutil secureErase freespace 0 /dev/disk1s1
    "E:\Program Files (x86)\VMware\VMware Workstation\vmware-vdiskmanager.exe" -k "l:\Data\Virtual Machines\Mac\macOS Mojave.vmdk"
* Allow apps downloaded from anywhere
    sudo spctl --master-disable
    Check this policy in security settings